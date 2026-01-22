/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css } from 'lit';

/**
 * Base styles for vaadin-clock - Amiga Workbench 1.2 aesthetic
 */
export const clockStyles = css`
  :host {
    /* Amiga Workbench 1.2 color palette */
    --vaadin-clock-size: 120px;
    --vaadin-clock-background: #0055aa;
    --vaadin-clock-face-color: #aaaaaa;
    --vaadin-clock-inner-face-color: #ffffff;
    --vaadin-clock-border-color: #ffffff;
    --vaadin-clock-border-shadow: #000000;
    --vaadin-clock-hour-hand-color: #000000;
    --vaadin-clock-minute-hand-color: #000000;
    --vaadin-clock-second-hand-color: #ff8800;
    --vaadin-clock-tick-color: #000000;
    --vaadin-clock-center-color: #ff8800;
    --vaadin-clock-label-color: currentColor;

    display: inline-block;
    width: var(--vaadin-clock-size);
    height: auto;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Label styling */
  [part='label'] {
    display: block;
    font-family: sans-serif;
    font-size: 0.875em;
    font-weight: 500;
    margin-bottom: 0.25em;
    color: var(--vaadin-clock-label-color);
  }

  [part='label']:empty {
    display: none;
  }

  .clock-container {
    width: var(--vaadin-clock-size);
    height: var(--vaadin-clock-size);
    background: var(--vaadin-clock-background);
    /* Amiga-style beveled border */
    border: 2px solid var(--vaadin-clock-border-color);
    border-right-color: var(--vaadin-clock-border-shadow);
    border-bottom-color: var(--vaadin-clock-border-shadow);
    box-sizing: border-box;
    /* Pixelated rendering for retro feel */
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }

  .clock-svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .clock-face {
    fill: var(--vaadin-clock-face-color);
    stroke: var(--vaadin-clock-border-shadow);
    stroke-width: 1;
  }

  .clock-inner-face {
    fill: var(--vaadin-clock-inner-face-color);
    stroke: var(--vaadin-clock-border-shadow);
    stroke-width: 0.5;
  }

  .tick {
    stroke: var(--vaadin-clock-tick-color);
    stroke-width: 1.5;
    stroke-linecap: square;
  }

  .tick-main {
    stroke-width: 2.5;
  }

  .hour-hand {
    stroke: var(--vaadin-clock-hour-hand-color);
    stroke-width: 4;
    stroke-linecap: square;
  }

  .minute-hand {
    stroke: var(--vaadin-clock-minute-hand-color);
    stroke-width: 3;
    stroke-linecap: square;
  }

  .second-hand {
    stroke: var(--vaadin-clock-second-hand-color);
    stroke-width: 1.5;
    stroke-linecap: square;
  }

  .center-dot {
    fill: var(--vaadin-clock-center-color);
    stroke: var(--vaadin-clock-border-shadow);
    stroke-width: 0.5;
  }

  /* Ensure crisp edges for the retro look */
  line,
  rect {
    shape-rendering: crispEdges;
  }

  /* Interactive state styling */
  :host([adjustable]:not([disabled]):not([readonly])) {
    cursor: pointer;
  }

  :host(:focus) {
    outline: 2px solid var(--vaadin-clock-second-hand-color);
    outline-offset: 2px;
  }

  :host(:focus:not(:focus-visible)) {
    outline: none;
  }

  :host(:focus-visible) {
    outline: 2px solid var(--vaadin-clock-second-hand-color);
    outline-offset: 2px;
  }

  /* Invisible hit area for easier hand dragging */
  .hand-hitarea {
    stroke: transparent;
    stroke-width: 12;
    stroke-linecap: round;
    pointer-events: none;
  }

  /* Hand group for hover/drag effects */
  .hand-group {
    pointer-events: none;
  }

  .hand-group.draggable {
    pointer-events: stroke;
    cursor: grab;
  }

  .hand-group.draggable:active {
    cursor: grabbing;
  }

  .hand-group.draggable .hand-hitarea {
    pointer-events: stroke;
  }

  /* Hover effect on hands when interactive */
  .hand-group.draggable:hover .hour-hand,
  .hand-group.draggable:hover .minute-hand,
  .hand-group.draggable:hover .second-hand {
    filter: drop-shadow(0 0 2px var(--vaadin-clock-second-hand-color));
  }

  /* Make inner face clickable when interactive */
  .interactive .clock-inner-face {
    cursor: crosshair;
  }

  /* AM/PM indicator icons */
  .sun-icon,
  .moon-icon {
    fill: var(--vaadin-clock-tick-color);
    pointer-events: none;
    user-select: none;
  }

  .sun-icon.active,
  .moon-icon.active {
    fill: var(--vaadin-clock-second-hand-color);
  }

  .sun-icon.clickable,
  .moon-icon.clickable {
    pointer-events: auto;
    cursor: pointer;
  }

  .sun-icon.clickable:hover,
  .moon-icon.clickable:hover {
    fill: var(--vaadin-clock-second-hand-color);
  }

  /* ========================================
   * Lumo Theme Variant
   * Modern, clean appearance using Lumo design tokens
   * ======================================== */
  :host([theme~='lumo']) {
    --vaadin-clock-background: var(--lumo-contrast-5pct, #f3f5f7);
    --vaadin-clock-face-color: var(--lumo-base-color, #ffffff);
    --vaadin-clock-inner-face-color: var(--lumo-base-color, #ffffff);
    --vaadin-clock-border-color: var(--lumo-contrast-20pct, #d4d8dd);
    --vaadin-clock-border-shadow: var(--lumo-contrast-30pct, #c4c9cf);
    --vaadin-clock-hour-hand-color: var(--lumo-contrast-80pct, #3b4049);
    --vaadin-clock-minute-hand-color: var(--lumo-contrast-70pct, #545a65);
    --vaadin-clock-second-hand-color: var(--lumo-primary-color, #1676f3);
    --vaadin-clock-tick-color: var(--lumo-contrast-50pct, #7c8490);
    --vaadin-clock-center-color: var(--lumo-primary-color, #1676f3);
    --vaadin-clock-label-color: var(--lumo-secondary-text-color, #6b7280);
  }

  :host([theme~='lumo']) .clock-container {
    border-radius: var(--lumo-border-radius-m, 8px);
    border: 1px solid var(--lumo-contrast-20pct, #d4d8dd);
    box-shadow: var(--lumo-box-shadow-xs, 0 1px 2px rgba(0, 0, 0, 0.05));
  }

  :host([theme~='lumo']) .clock-face {
    stroke-width: 0.5;
  }

  :host([theme~='lumo']) .clock-inner-face {
    rx: 4;
    ry: 4;
  }

  :host([theme~='lumo']) .hour-hand,
  :host([theme~='lumo']) .minute-hand {
    stroke-linecap: round;
  }

  :host([theme~='lumo']) .tick {
    stroke-width: 1;
  }

  :host([theme~='lumo']) .tick-main {
    stroke-width: 1.5;
  }

  :host([theme~='lumo']:focus-visible) {
    outline: 2px solid var(--lumo-primary-color, #1676f3);
    outline-offset: 2px;
  }

  /* Lumo Dark Mode - cooler blue-gray tones */
  :host([theme~='lumo'][theme~='dark']),
  :host-context([theme~='dark']) :host([theme~='lumo']),
  :host-context(html[theme~='dark']) :host([theme~='lumo']) {
    --vaadin-clock-background: var(--lumo-contrast-10pct, #252a31);
    --vaadin-clock-face-color: var(--lumo-base-color, #1a1f26);
    --vaadin-clock-inner-face-color: var(--lumo-base-color, #1a1f26);
    --vaadin-clock-border-color: var(--lumo-contrast-20pct, #3a4250);
    --vaadin-clock-border-shadow: var(--lumo-contrast-5pct, #12161c);
    --vaadin-clock-hour-hand-color: var(--lumo-contrast-90pct, #e0e4ea);
    --vaadin-clock-minute-hand-color: var(--lumo-contrast-80pct, #b8bec8);
    --vaadin-clock-tick-color: var(--lumo-contrast-50pct, #6b7280);
    --vaadin-clock-label-color: var(--lumo-secondary-text-color, #8b95a5);
  }

  :host([theme~='lumo'][theme~='dark']) .clock-container,
  :host-context([theme~='dark']) :host([theme~='lumo']) .clock-container {
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  /* ========================================
   * Aura Theme Variant
   * Refined, professional appearance using Aura design tokens
   * ======================================== */
  :host([theme~='aura']) {
    --vaadin-clock-background: var(--aura-background-color, #fafafa);
    --vaadin-clock-face-color: var(--aura-background-color, #ffffff);
    --vaadin-clock-inner-face-color: var(--aura-background-color, #ffffff);
    --vaadin-clock-border-color: var(--aura-border-color, #e0e0e0);
    --vaadin-clock-border-shadow: var(--aura-border-color, #d0d0d0);
    --vaadin-clock-hour-hand-color: var(--aura-text-color, #1a1a1a);
    --vaadin-clock-minute-hand-color: var(--aura-secondary-text-color, #4a4a4a);
    --vaadin-clock-second-hand-color: var(--aura-accent-color, #0066cc);
    --vaadin-clock-tick-color: var(--aura-tertiary-text-color, #808080);
    --vaadin-clock-center-color: var(--aura-accent-color, #0066cc);
    --vaadin-clock-label-color: var(--aura-secondary-text-color, #4a4a4a);
  }

  :host([theme~='aura']) .clock-container {
    border-radius: var(--aura-base-radius, 4px);
    border: 1px solid var(--aura-border-color, #e0e0e0);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  :host([theme~='aura']) .clock-face {
    stroke-width: 0.5;
  }

  :host([theme~='aura']) .clock-inner-face {
    rx: 2;
    ry: 2;
  }

  :host([theme~='aura']) .hour-hand,
  :host([theme~='aura']) .minute-hand,
  :host([theme~='aura']) .second-hand {
    stroke-linecap: round;
  }

  :host([theme~='aura']) .tick {
    stroke-width: 1;
  }

  :host([theme~='aura']) .tick-main {
    stroke-width: 2;
  }

  :host([theme~='aura']:focus-visible) {
    outline: 2px solid var(--aura-accent-color, #0066cc);
    outline-offset: 2px;
  }

  /* Aura Dark Mode - warmer neutral tones */
  :host([theme~='aura'][theme~='dark']),
  :host-context([theme~='dark']) :host([theme~='aura']),
  :host-context(html[theme~='dark']) :host([theme~='aura']) {
    --vaadin-clock-background: var(--aura-background-color-dark, #1f1e1c);
    --vaadin-clock-face-color: var(--aura-background-color-dark, #2a2825);
    --vaadin-clock-inner-face-color: var(--aura-background-color-dark, #2a2825);
    --vaadin-clock-border-color: var(--aura-border-color-dark, #3d3a36);
    --vaadin-clock-border-shadow: var(--aura-border-color-dark, #141312);
    --vaadin-clock-hour-hand-color: var(--aura-text-color-dark, #f5f3f0);
    --vaadin-clock-minute-hand-color: var(--aura-secondary-text-color-dark, #c0bbb5);
    --vaadin-clock-tick-color: var(--aura-tertiary-text-color-dark, #807a72);
    --vaadin-clock-label-color: var(--aura-secondary-text-color-dark, #a8a29e);
  }

  :host([theme~='aura'][theme~='dark']) .clock-container,
  :host-context([theme~='dark']) :host([theme~='aura']) .clock-container {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    border-color: #4a4640;
  }
`;
