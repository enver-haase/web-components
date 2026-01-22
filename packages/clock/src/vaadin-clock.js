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
    };
  }

  constructor() {
    super();
    this._boundAnimate = this._animate.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._startAnimation();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
  }

  /** @protected */
  render() {
    const hourAngle = (this._hours % 12) * 30 + this._minutes * 0.5 + this._seconds * (0.5 / 60);
    const minuteAngle = this._minutes * 6 + this._seconds * 0.1;
    const secondAngle = this._seconds * 6;

    return html`
      <div part="clock" class="clock-container">
        <svg viewBox="0 0 100 100" class="clock-svg">
          <!-- Clock face background -->
          <rect part="face" class="clock-face" x="5" y="5" width="90" height="90" rx="2" ry="2" />

          <!-- Inner face -->
          <rect class="clock-inner-face" x="10" y="10" width="80" height="80" rx="1" ry="1" />

          <!-- Hour ticks -->
          ${this._renderTicks()}

          <!-- Hour hand -->
          <line
            part="hour-hand"
            class="hour-hand"
            x1="50"
            y1="50"
            x2="50"
            y2="28"
            transform="rotate(${hourAngle}, 50, 50)"
          />

          <!-- Minute hand -->
          <line
            part="minute-hand"
            class="minute-hand"
            x1="50"
            y1="50"
            x2="50"
            y2="20"
            transform="rotate(${minuteAngle}, 50, 50)"
          />

          <!-- Second hand -->
          <line
            part="second-hand"
            class="second-hand"
            x1="50"
            y1="55"
            x2="50"
            y2="18"
            transform="rotate(${secondAngle}, 50, 50)"
          />

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
