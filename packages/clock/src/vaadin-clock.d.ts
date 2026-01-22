/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 * When the `value` is `null` or empty, the clock displays the current time
 * and animates in real-time.
 *
 * The clock is styled to resemble the classic Amiga Workbench 1.2 clock,
 * with its distinctive retro aesthetic.
 *
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class Clock extends ThemableMixin(ElementMixin(LitElement)) {
  /**
   * The time value in HH:mm:ss or HH:mm format.
   * When null or empty, displays and animates the current time.
   */
  value: string | null;

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
