/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement, svg } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { clockStyles } from './styles/vaadin-clock-base-styles.js';

/**
 * `<vaadin-clock>` is a Web Component displaying an analog clock face.
 *
 * ```html
 * <vaadin-clock></vaadin-clock>
 * ```
 * ```js
 * clock.value = '14:30:00';
 * ```
 *
 * When the `value` is `null` or empty, the clock displays the current time
 * and animates in real-time.
 *
 * The clock is styled to resemble the classic Amiga Workbench 1.2 clock,
 * with its distinctive retro aesthetic.
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property                    | Description                | Default
 * -----------------------------------|----------------------------|---------
 * `--vaadin-clock-size`              | Size of the clock          | `120px`
 * `--vaadin-clock-background`        | Background color           | `#0055AA`
 * `--vaadin-clock-face-color`        | Clock face color           | `#AAAAAA`
 * `--vaadin-clock-border-color`      | Border color               | `#FFFFFF`
 * `--vaadin-clock-hour-hand-color`   | Hour hand color            | `#000000`
 * `--vaadin-clock-minute-hand-color` | Minute hand color          | `#000000`
 * `--vaadin-clock-second-hand-color` | Second hand color          | `#FF8800`
 * `--vaadin-clock-tick-color`        | Tick marks color           | `#000000`
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|----------------
 * `clock`         | The clock container
 * `face`          | The clock face circle
 * `hour-hand`     | The hour hand
 * `minute-hand`   | The minute hand
 * `second-hand`   | The second hand
 * `center`        | The center dot
 *
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Clock extends ThemableMixin(ElementMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-clock';
  }

  static get styles() {
    return [clockStyles];
  }

  static get properties() {
    return {
      /**
       * The time value in HH:mm:ss or HH:mm format.
       * When null or empty, displays and animates the current time.
       * @type {string | null}
       */
      value: {
        type: String,
        value: null,
        notify: true,
        observer: '_valueChanged',
      },

      /**
       * The minimum allowed time in HH:mm:ss or HH:mm format.
       * @type {string | null}
       */
      min: {
        type: String,
        value: null,
      },

      /**
       * The maximum allowed time in HH:mm:ss or HH:mm format.
       * @type {string | null}
       */
      max: {
        type: String,
        value: null,
      },

      /**
       * Whether the clock is disabled.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Whether the clock is readonly.
       * @type {boolean}
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Whether the clock time can be adjusted by the user via dragging
       * clock hands or using keyboard arrow keys. Enabled by default.
       * @type {boolean}
       */
      adjustable: {
        type: Boolean,
        value: true,
        reflectToAttribute: true,
      },

      /**
       * The time interval in seconds for step-based adjustments when using
       * keyboard arrow keys. Follows the same convention as TimePicker.
       * Default is 60 seconds (1 minute).
       * @type {number}
       */
      step: {
        type: Number,
        value: 60,
      },

      /**
       * Internal: current displayed hours (0-23).
       * @private
       */
      _hours: {
        type: Number,
        value: 0,
      },

      /**
       * Internal: current displayed minutes (0-59).
       * @private
       */
      _minutes: {
        type: Number,
        value: 0,
      },

      /**
       * Internal: current displayed seconds (0-59).
       * @private
       */
      _seconds: {
        type: Number,
        value: 0,
      },

      /**
       * Internal: animation frame ID for cleanup.
       * @private
       */
      _animationFrameId: {
        type: Number,
        value: null,
      },

      /**
       * Internal: which hand is being dragged ('hour', 'minute', 'second', or null).
       * @private
       */
      _draggingHand: {
        type: String,
        value: null,
      },

      /**
       * Internal: tracks if component has focus for keyboard interaction.
       * @private
       */
      _focused: {
        type: Boolean,
        value: false,
      },
    };
  }

  constructor() {
    super();
    this._boundAnimate = this._animate.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._startAnimation();
    // Add global listeners for drag continuation
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
    document.addEventListener('touchmove', this._onTouchMove, { passive: false });
    document.addEventListener('touchend', this._onTouchEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
    // Remove global listeners
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('touchend', this._onTouchEnd);
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();
    // Make focusable for keyboard interaction
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    this.addEventListener('keydown', this._onKeyDown);
    this.addEventListener('focus', this._onFocus);
    this.addEventListener('blur', this._onBlur);
  }

  /** @protected */
  render() {
    const hourAngle = (this._hours % 12) * 30 + this._minutes * 0.5 + this._seconds * (0.5 / 60);
    const minuteAngle = this._minutes * 6 + this._seconds * 0.1;
    const secondAngle = this._seconds * 6;
    const isInteractive = this._isInteractive();

    return html`
      <div part="clock" class="clock-container ${isInteractive ? 'interactive' : ''}">
        <svg viewBox="0 0 100 100" class="clock-svg">
          <!-- Clock face background -->
          <rect part="face" class="clock-face" x="5" y="5" width="90" height="90" rx="2" ry="2" />

          <!-- Inner face -->
          <rect
            class="clock-inner-face"
            x="10"
            y="10"
            width="80"
            height="80"
            rx="1"
            ry="1"
            @mousedown=${this._onFaceMouseDown}
            @touchstart=${this._onFaceTouchStart}
          />

          <!-- Hour ticks -->
          ${this._renderTicks()}

          <!-- Hour hand (with larger hit area for dragging) -->
          <g
            class="hand-group ${isInteractive ? 'draggable' : ''}"
            @mousedown=${(e) => this._onMouseDown(e, 'hour')}
            @touchstart=${(e) => this._onTouchStart(e, 'hour')}
          >
            <line class="hand-hitarea" x1="50" y1="50" x2="50" y2="28" transform="rotate(${hourAngle}, 50, 50)" />
            <line
              part="hour-hand"
              class="hour-hand"
              x1="50"
              y1="50"
              x2="50"
              y2="28"
              transform="rotate(${hourAngle}, 50, 50)"
            />
          </g>

          <!-- Minute hand (with larger hit area for dragging) -->
          <g
            class="hand-group ${isInteractive ? 'draggable' : ''}"
            @mousedown=${(e) => this._onMouseDown(e, 'minute')}
            @touchstart=${(e) => this._onTouchStart(e, 'minute')}
          >
            <line class="hand-hitarea" x1="50" y1="50" x2="50" y2="20" transform="rotate(${minuteAngle}, 50, 50)" />
            <line
              part="minute-hand"
              class="minute-hand"
              x1="50"
              y1="50"
              x2="50"
              y2="20"
              transform="rotate(${minuteAngle}, 50, 50)"
            />
          </g>

          <!-- Second hand (with larger hit area for dragging) -->
          <g
            class="hand-group ${isInteractive ? 'draggable' : ''}"
            @mousedown=${(e) => this._onMouseDown(e, 'second')}
            @touchstart=${(e) => this._onTouchStart(e, 'second')}
          >
            <line class="hand-hitarea" x1="50" y1="55" x2="50" y2="18" transform="rotate(${secondAngle}, 50, 50)" />
            <line
              part="second-hand"
              class="second-hand"
              x1="50"
              y1="55"
              x2="50"
              y2="18"
              transform="rotate(${secondAngle}, 50, 50)"
            />
          </g>

          <!-- Center dot -->
          <rect part="center" class="center-dot" x="47" y="47" width="6" height="6" />
        </svg>
      </div>
    `;
  }

  /** @private */
  _renderTicks() {
    const ticks = [];
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      const isMainTick = i % 3 === 0;
      const innerRadius = isMainTick ? 35 : 38;
      const outerRadius = 42;

      const x1 = 50 + innerRadius * Math.sin((angle * Math.PI) / 180);
      const y1 = 50 - innerRadius * Math.cos((angle * Math.PI) / 180);
      const x2 = 50 + outerRadius * Math.sin((angle * Math.PI) / 180);
      const y2 = 50 - outerRadius * Math.cos((angle * Math.PI) / 180);

      ticks.push(svg`
        <line
          class="tick ${isMainTick ? 'tick-main' : ''}"
          x1="${x1}"
          y1="${y1}"
          x2="${x2}"
          y2="${y2}"
        />
      `);
    }
    return ticks;
  }

  /** @private */
  _valueChanged(newValue) {
    if (newValue) {
      this._stopAnimation();
      this._parseAndSetTime(newValue);
    } else {
      this._startAnimation();
    }
  }

  /** @private */
  _parseAndSetTime(timeString) {
    if (!timeString) return;

    const parts = timeString.split(':');
    if (parts.length >= 2) {
      this._hours = parseInt(parts[0], 10) || 0;
      this._minutes = parseInt(parts[1], 10) || 0;
      this._seconds = parts.length >= 3 ? parseInt(parts[2], 10) || 0 : 0;
    }
  }

  /** @private */
  _startAnimation() {
    if (this.value) return; // Don't animate if value is set

    // Use setInterval for second-precision updates to save CPU
    this._animate();
    this._intervalId = setInterval(() => this._animate(), 1000);
  }

  /** @private */
  _animate() {
    if (this.value) return;

    const now = new Date();
    this._hours = now.getHours();
    this._minutes = now.getMinutes();
    this._seconds = now.getSeconds();
  }

  /** @private */
  _stopAnimation() {
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  /**
   * Checks if the clock allows user interaction.
   * @private
   */
  _isInteractive() {
    return this.adjustable && !this.disabled && !this.readonly;
  }

  /**
   * Focus event handler.
   * @private
   */
  _onFocus() {
    this._focused = true;
  }

  /**
   * Blur event handler.
   * @private
   */
  _onBlur() {
    this._focused = false;
  }

  /**
   * Keyboard event handler for arrow key time adjustment.
   * @private
   */
  _onKeyDown(e) {
    if (!this._isInteractive() || !this._focused) return;

    const step = this.step || 60;
    let handled = false;

    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      this._adjustTimeByStep(step);
      handled = true;
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      this._adjustTimeByStep(-step);
      handled = true;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * Adjusts the current time by the given step in seconds.
   * @param {number} stepSeconds - Positive or negative seconds to adjust
   * @private
   */
  _adjustTimeByStep(stepSeconds) {
    // If animating (no value), stop animation and use current time
    if (!this.value) {
      const now = new Date();
      this._hours = now.getHours();
      this._minutes = now.getMinutes();
      this._seconds = now.getSeconds();
      this._stopAnimation();
    }

    // Convert current time to total seconds
    let totalSeconds = this._hours * 3600 + this._minutes * 60 + this._seconds;
    totalSeconds += stepSeconds;

    // Wrap around 24 hours
    const daySeconds = 24 * 3600;
    if (totalSeconds < 0) {
      totalSeconds += daySeconds;
    } else if (totalSeconds >= daySeconds) {
      totalSeconds -= daySeconds;
    }

    // Convert back to hours, minutes, seconds
    const newHours = Math.floor(totalSeconds / 3600);
    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
    const newSeconds = totalSeconds % 60;

    // Validate against min/max
    const newValue = Clock.formatTime(newHours, newMinutes, newSeconds);
    if (this._isWithinBounds(newValue)) {
      this._setTimeValue(newHours, newMinutes, newSeconds);
    }
  }

  /**
   * Sets the time and fires value-changed event.
   * @private
   */
  _setTimeValue(hours, minutes, seconds) {
    this._hours = hours;
    this._minutes = minutes;
    this._seconds = seconds;
    this.value = Clock.formatTime(hours, minutes, seconds);
  }

  /**
   * Checks if a time value is within min/max bounds.
   * @private
   */
  _isWithinBounds(timeString) {
    if (!this.min && !this.max) return true;

    const time = Clock.parseTime(timeString);
    if (!time) return true;

    const timeMinutes = time.hours * 60 + time.minutes + time.seconds / 60;

    if (this.min) {
      const minTime = Clock.parseTime(this.min);
      if (minTime) {
        const minMinutes = minTime.hours * 60 + minTime.minutes + minTime.seconds / 60;
        if (timeMinutes < minMinutes) return false;
      }
    }

    if (this.max) {
      const maxTime = Clock.parseTime(this.max);
      if (maxTime) {
        const maxMinutes = maxTime.hours * 60 + maxTime.minutes + maxTime.seconds / 60;
        if (timeMinutes > maxMinutes) return false;
      }
    }

    return true;
  }

  /**
   * Mouse down on clock face (not on hands) - set time to clicked position.
   * @private
   */
  _onFaceMouseDown(e) {
    if (!this._isInteractive()) return;
    this._handleFaceClick(e.clientX, e.clientY);
  }

  /**
   * Touch start on clock face.
   * @private
   */
  _onFaceTouchStart(e) {
    if (!this._isInteractive()) return;
    if (e.touches.length === 1) {
      this._handleFaceClick(e.touches[0].clientX, e.touches[0].clientY);
    }
  }

  /**
   * Handle click on clock face to set minute hand position.
   * @private
   */
  _handleFaceClick(clientX, clientY) {
    const angle = this._getAngleFromPoint(clientX, clientY);
    const minutes = Math.round(angle / 6) % 60;

    // If animating, stop and use current hour
    if (!this.value) {
      const now = new Date();
      this._hours = now.getHours();
      this._stopAnimation();
    }

    const newValue = Clock.formatTime(this._hours, minutes, 0);
    if (this._isWithinBounds(newValue)) {
      this._setTimeValue(this._hours, minutes, 0);
    }
  }

  /**
   * Mouse down on a clock hand - start dragging.
   * @private
   */
  _onMouseDown(e, hand) {
    if (!this._isInteractive()) return;
    e.preventDefault();
    e.stopPropagation();
    this._startDrag(hand);
  }

  /**
   * Touch start on a clock hand.
   * @private
   */
  _onTouchStart(e, hand) {
    if (!this._isInteractive()) return;
    e.preventDefault();
    e.stopPropagation();
    this._startDrag(hand);
  }

  /**
   * Start dragging a hand.
   * @private
   */
  _startDrag(hand) {
    this._draggingHand = hand;

    // If animating, stop and capture current time
    if (!this.value) {
      const now = new Date();
      this._hours = now.getHours();
      this._minutes = now.getMinutes();
      this._seconds = now.getSeconds();
      this._stopAnimation();
    }
  }

  /**
   * Mouse move during drag.
   * @private
   */
  _onMouseMove(e) {
    if (!this._draggingHand) return;
    this._handleDrag(e.clientX, e.clientY);
  }

  /**
   * Touch move during drag.
   * @private
   */
  _onTouchMove(e) {
    if (!this._draggingHand) return;
    if (e.touches.length === 1) {
      e.preventDefault();
      this._handleDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  }

  /**
   * Handle drag movement to update time.
   * @private
   */
  _handleDrag(clientX, clientY) {
    const angle = this._getAngleFromPoint(clientX, clientY);

    let newHours = this._hours;
    let newMinutes = this._minutes;
    let newSeconds = this._seconds;

    switch (this._draggingHand) {
      case 'hour': {
        // Convert angle to hours (0-11), preserving AM/PM
        const hourValue = Math.round(angle / 30) % 12;
        const isPM = this._hours >= 12;
        newHours = hourValue + (isPM ? 12 : 0);
        if (newHours === 24) newHours = 12;
        if (newHours === 0 && isPM) newHours = 12;
        break;
      }

      case 'minute':
        newMinutes = Math.round(angle / 6) % 60;
        break;

      case 'second':
        newSeconds = Math.round(angle / 6) % 60;
        break;

      default:
        // No-op for unknown hand types
        break;
    }

    const newValue = Clock.formatTime(newHours, newMinutes, newSeconds);
    if (this._isWithinBounds(newValue)) {
      this._hours = newHours;
      this._minutes = newMinutes;
      this._seconds = newSeconds;
      this.requestUpdate();
    }
  }

  /**
   * Mouse up - end dragging.
   * @private
   */
  _onMouseUp() {
    if (this._draggingHand) {
      this._endDrag();
    }
  }

  /**
   * Touch end - end dragging.
   * @private
   */
  _onTouchEnd() {
    if (this._draggingHand) {
      this._endDrag();
    }
  }

  /**
   * End dragging and commit the value.
   * @private
   */
  _endDrag() {
    if (this._draggingHand) {
      this._draggingHand = null;
      // Commit the final value
      this.value = Clock.formatTime(this._hours, this._minutes, this._seconds);
    }
  }

  /**
   * Calculate angle from center of clock to a point.
   * @private
   */
  _getAngleFromPoint(clientX, clientY) {
    const svg = this.shadowRoot.querySelector('.clock-svg');
    if (!svg) return 0;

    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Calculate angle in degrees (0 = 12 o'clock, clockwise)
    let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    return angle;
  }

  /**
   * Parses a time string and returns components.
   * @param {string} timeString - Time in HH:mm:ss or HH:mm format
   * @returns {{ hours: number, minutes: number, seconds: number } | null}
   */
  static parseTime(timeString) {
    if (!timeString) return null;

    const parts = timeString.split(':');
    if (parts.length < 2) return null;

    return {
      hours: parseInt(parts[0], 10) || 0,
      minutes: parseInt(parts[1], 10) || 0,
      seconds: parts.length >= 3 ? parseInt(parts[2], 10) || 0 : 0,
    };
  }

  /**
   * Formats time components to a string.
   * @param {number} hours
   * @param {number} minutes
   * @param {number} seconds
   * @returns {string}
   */
  static formatTime(hours, minutes, seconds = 0) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}

defineCustomElement(Clock);

export { Clock };
