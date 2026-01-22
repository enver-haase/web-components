/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Theme variant constants for the clock component.
 */
export declare const ClockTheme: {
  /** Lumo theme - modern, clean appearance */
  readonly LUMO: 'lumo';
  /** Aura theme - refined, professional appearance */
  readonly AURA: 'aura';
  /** Dark mode - can be combined with LUMO or AURA */
  readonly DARK: 'dark';
};

/**
 * Fired when the `value` property changes.
 */
export type ClockValueChangedEvent = CustomEvent<{ value: string | null }>;

export interface ClockCustomEventMap {
  'value-changed': ClockValueChangedEvent;
}

export interface ClockEventMap extends HTMLElementEventMap, ClockCustomEventMap {}

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
 * When the `value` is `null` or empty and `running` is `false`, the clock
 * displays the current time statically. Set `running` to `true` to animate.
 *
 * The clock is styled to resemble the classic Amiga Workbench 1.2 clock,
 * with its distinctive retro aesthetic. Theme variants are available:
 *
 * ```html
 * <!-- Lumo theme -->
 * <vaadin-clock theme="lumo"></vaadin-clock>
 *
 * <!-- Aura theme with dark mode -->
 * <vaadin-clock theme="aura dark"></vaadin-clock>
 * ```
 *
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class Clock extends ThemableMixin(ElementMixin(LitElement)) {
  /**
   * Theme variant constants.
   */
  static Theme: typeof ClockTheme;

  /**
   * The time value in HH:mm:ss or HH:mm format.
   * When running, getValue() returns base time + elapsed running time.
   */
  value: string | null;

  /**
   * Whether the clock is running (animating).
   * When running, the displayed time advances in real-time from the
   * base value set via setValue(). Default is false.
   */
  running: boolean;

  /**
   * The minimum allowed time in HH:mm:ss or HH:mm format.
   */
  min: string | null;

  /**
   * The maximum allowed time in HH:mm:ss or HH:mm format.
   */
  max: string | null;

  /**
   * Whether the clock is disabled.
   */
  disabled: boolean;

  /**
   * Whether the clock is readonly.
   */
  readonly: boolean;

  /**
   * Whether the clock time can be adjusted by the user via dragging
   * clock hands or using keyboard arrow keys. Enabled by default.
   */
  adjustable: boolean;

  /**
   * The time interval in seconds for step-based adjustments when using
   * keyboard arrow keys. Follows the same convention as TimePicker.
   * Default is 60 seconds (1 minute).
   */
  step: number;

  /**
   * Label for the clock, displayed above the clock face.
   */
  label: string;

  /**
   * Accessible name for the clock, used for screen readers.
   * Maps to aria-label attribute.
   */
  accessibleName: string | null;

  /**
   * ID of an element that labels the clock, used for screen readers.
   * Maps to aria-labelledby attribute.
   */
  accessibleNameRef: string | null;

  /**
   * Gets the current value, accounting for running time if applicable.
   */
  getValue(): string | null;

  /**
   * Sets the value and resets accumulated running time.
   * @param value - Time in HH:mm:ss or HH:mm format
   */
  setValue(value: string): void;

  /**
   * Parses a time string and returns components.
   * @param timeString - Time in HH:mm:ss or HH:mm format
   */
  static parseTime(timeString: string): { hours: number; minutes: number; seconds: number } | null;

  /**
   * Formats time components to a string.
   */
  static formatTime(hours: number, minutes: number, seconds?: number): string;

  addEventListener<K extends keyof ClockEventMap>(
    type: K,
    listener: (this: Clock, ev: ClockEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof ClockEventMap>(
    type: K,
    listener: (this: Clock, ev: ClockEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-clock': Clock;
  }
}

export { Clock };
