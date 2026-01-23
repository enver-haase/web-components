import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-clock.js';

describe('vaadin-clock', () => {
  let clock;

  beforeEach(async () => {
    clock = fixtureSync(`<vaadin-clock></vaadin-clock>`);
    await nextRender();
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = clock.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('default state', () => {
    it('should have null value by default', () => {
      expect(clock.value).to.be.null;
    });

    it('should not be running by default', () => {
      expect(clock.running).to.be.false;
    });

    it('should be adjustable by default', () => {
      expect(clock.adjustable).to.be.true;
    });

    it('should have step of 60 by default', () => {
      expect(clock.step).to.equal(60);
    });

    it('should not be disabled by default', () => {
      expect(clock.disabled).to.be.false;
    });

    it('should not be readonly by default', () => {
      expect(clock.readonly).to.be.false;
    });

    it('should have empty label by default', () => {
      expect(clock.label).to.equal('');
    });

    it('should have null min by default', () => {
      expect(clock.min).to.be.null;
    });

    it('should have null max by default', () => {
      expect(clock.max).to.be.null;
    });

    it('should be focusable', () => {
      expect(clock.getAttribute('tabindex')).to.equal('0');
    });

    it('should have role="img"', () => {
      expect(clock.getAttribute('role')).to.equal('img');
    });
  });

  describe('value property', () => {
    it('should accept HH:mm:ss format', () => {
      clock.value = '14:30:45';
      expect(clock.value).to.equal('14:30:45');
    });

    it('should accept HH:mm format', async () => {
      clock.value = '14:30';
      await nextFrame();
      expect(clock._hours).to.equal(14);
      expect(clock._minutes).to.equal(30);
      expect(clock._seconds).to.equal(0);
    });

    it('should update internal time state', async () => {
      clock.value = '09:15:30';
      await nextFrame();
      expect(clock._hours).to.equal(9);
      expect(clock._minutes).to.equal(15);
      expect(clock._seconds).to.equal(30);
    });

    it('should fire value-changed event when value changes', async () => {
      const spy = sinon.spy();
      clock.addEventListener('value-changed', spy);
      clock.value = '12:00:00';
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should not fire value-changed event when setting same value', () => {
      clock.value = '12:00:00';
      const spy = sinon.spy();
      clock.addEventListener('value-changed', spy);
      clock.value = '12:00:00';
      expect(spy.called).to.be.false;
    });
  });

  describe('parseTime static method', () => {
    it('should parse HH:mm:ss format', () => {
      const result = clock.constructor.parseTime('14:30:45');
      expect(result).to.deep.equal({ hours: 14, minutes: 30, seconds: 45 });
    });

    it('should parse HH:mm format', () => {
      const result = clock.constructor.parseTime('09:15');
      expect(result).to.deep.equal({ hours: 9, minutes: 15, seconds: 0 });
    });

    it('should return null for empty string', () => {
      expect(clock.constructor.parseTime('')).to.be.null;
    });

    it('should return null for null', () => {
      expect(clock.constructor.parseTime(null)).to.be.null;
    });

    it('should return null for invalid format', () => {
      expect(clock.constructor.parseTime('invalid')).to.be.null;
    });
  });

  describe('formatTime static method', () => {
    it('should format time with hours, minutes, and seconds', () => {
      expect(clock.constructor.formatTime(9, 5, 3)).to.equal('09:05:03');
    });

    it('should pad single digits with zeros', () => {
      expect(clock.constructor.formatTime(1, 2, 3)).to.equal('01:02:03');
    });

    it('should default seconds to 0', () => {
      expect(clock.constructor.formatTime(12, 30)).to.equal('12:30:00');
    });
  });

  describe('label property', () => {
    it('should display label when set', async () => {
      clock.label = 'Current Time';
      await nextFrame();
      const labelPart = clock.shadowRoot.querySelector('[part="label"]');
      expect(labelPart.textContent).to.equal('Current Time');
    });

    it('should be empty when label is not set', () => {
      const labelPart = clock.shadowRoot.querySelector('[part="label"]');
      expect(labelPart.textContent).to.equal('');
    });
  });

  describe('accessibility', () => {
    it('should set aria-label from accessibleName', async () => {
      clock.accessibleName = 'Departure time';
      await nextFrame();
      expect(clock.getAttribute('aria-label')).to.equal('Departure time');
    });

    it('should set aria-labelledby from accessibleNameRef', async () => {
      clock.accessibleNameRef = 'label-id';
      await nextFrame();
      expect(clock.getAttribute('aria-labelledby')).to.equal('label-id');
    });

    it('should remove aria-label when accessibleName is null', async () => {
      clock.accessibleName = 'Test';
      await nextFrame();
      clock.accessibleName = null;
      await nextFrame();
      expect(clock.hasAttribute('aria-label')).to.be.false;
    });
  });

  describe('min and max constraints', () => {
    it('should accept min property', () => {
      clock.min = '08:00:00';
      expect(clock.min).to.equal('08:00:00');
    });

    it('should accept max property', () => {
      clock.max = '17:00:00';
      expect(clock.max).to.equal('17:00:00');
    });

    it('should allow value within bounds', () => {
      clock.min = '08:00:00';
      clock.max = '17:00:00';
      clock.value = '12:00:00';
      expect(clock.value).to.equal('12:00:00');
    });
  });

  describe('adjustable property', () => {
    it('should reflect to attribute when true', () => {
      expect(clock.hasAttribute('adjustable')).to.be.true;
    });

    it('should reflect to attribute when false', async () => {
      clock.adjustable = false;
      await nextFrame();
      expect(clock.hasAttribute('adjustable')).to.be.false;
    });

    it('should make clock interactive when true', () => {
      clock.adjustable = true;
      clock.disabled = false;
      clock.readonly = false;
      expect(clock._isInteractive()).to.be.true;
    });

    it('should make clock non-interactive when false', () => {
      clock.adjustable = false;
      expect(clock._isInteractive()).to.be.false;
    });
  });

  describe('disabled property', () => {
    it('should reflect to attribute', async () => {
      clock.disabled = true;
      await nextFrame();
      expect(clock.hasAttribute('disabled')).to.be.true;
    });

    it('should prevent interaction when disabled', () => {
      clock.disabled = true;
      expect(clock._isInteractive()).to.be.false;
    });
  });

  describe('readonly property', () => {
    it('should reflect to attribute', async () => {
      clock.readonly = true;
      await nextFrame();
      expect(clock.hasAttribute('readonly')).to.be.true;
    });

    it('should prevent interaction when readonly', () => {
      clock.readonly = true;
      expect(clock._isInteractive()).to.be.false;
    });
  });

  describe('step property', () => {
    it('should accept custom step value', () => {
      clock.step = 300;
      expect(clock.step).to.equal(300);
    });

    it('should default to 60 seconds', () => {
      expect(clock.step).to.equal(60);
    });
  });

  describe('running property', () => {
    it('should reflect to attribute when true', async () => {
      clock.running = true;
      await nextFrame();
      expect(clock.hasAttribute('running')).to.be.true;
    });

    it('should not have running attribute by default', () => {
      expect(clock.hasAttribute('running')).to.be.false;
    });

    it('should start animation when set to true', async () => {
      clock.value = '12:00:00';
      await nextFrame();
      clock.running = true;
      await nextFrame();
      expect(clock._runStartTimestamp).to.not.be.null;
    });

    it('should stop animation when set to false', () => {
      clock.value = '12:00:00';
      clock.running = true;
      clock.running = false;
      expect(clock._runStartTimestamp).to.be.null;
    });
  });

  describe('getValue method', () => {
    it('should return value when not running', () => {
      clock.value = '12:30:45';
      expect(clock.getValue()).to.equal('12:30:45');
    });

    it('should return calculated time when running', async () => {
      clock.value = '12:00:00';
      clock.running = true;
      // Wait a bit for time to elapse
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      const value = clock.getValue();
      expect(value).to.not.be.null;
      // Value should be slightly past 12:00:00
      expect(value.startsWith('12:00:')).to.be.true;
    });
  });

  describe('setValue method', () => {
    it('should set value', () => {
      clock.setValue('14:30:00');
      expect(clock.value).to.equal('14:30:00');
    });

    it('should reset accumulated time', async () => {
      clock.value = '12:00:00';
      await nextFrame();
      clock.running = true;
      await nextFrame();
      clock._accumulatedMs = 5000;
      clock.setValue('14:00:00');
      await nextFrame();
      expect(clock._accumulatedMs).to.equal(0);
    });
  });

  describe('shadow DOM parts', () => {
    it('should have label part', () => {
      expect(clock.shadowRoot.querySelector('[part="label"]')).to.be.ok;
    });

    it('should have clock part', () => {
      expect(clock.shadowRoot.querySelector('[part="clock"]')).to.be.ok;
    });

    it('should have face part', () => {
      expect(clock.shadowRoot.querySelector('[part="face"]')).to.be.ok;
    });

    it('should have hour-hand part', () => {
      expect(clock.shadowRoot.querySelector('[part="hour-hand"]')).to.be.ok;
    });

    it('should have minute-hand part', () => {
      expect(clock.shadowRoot.querySelector('[part="minute-hand"]')).to.be.ok;
    });

    it('should have second-hand part', () => {
      expect(clock.shadowRoot.querySelector('[part="second-hand"]')).to.be.ok;
    });

    it('should have center part', () => {
      expect(clock.shadowRoot.querySelector('[part="center"]')).to.be.ok;
    });
  });

  describe('hand angles', () => {
    it('should position hour hand correctly at 3:00', async () => {
      clock.value = '03:00:00';
      await nextFrame();
      const hourHand = clock.shadowRoot.querySelector('[part="hour-hand"]');
      // At 3:00, hour hand should be at 90 degrees
      expect(hourHand.getAttribute('transform')).to.equal('rotate(90, 50, 50)');
    });

    it('should position minute hand correctly at 12:30', async () => {
      clock.value = '12:30:00';
      await nextFrame();
      const minuteHand = clock.shadowRoot.querySelector('[part="minute-hand"]');
      // At 30 minutes, minute hand should be at 180 degrees
      expect(minuteHand.getAttribute('transform')).to.equal('rotate(180, 50, 50)');
    });

    it('should position second hand correctly at 12:00:15', async () => {
      clock.value = '12:00:15';
      await nextFrame();
      const secondHand = clock.shadowRoot.querySelector('[part="second-hand"]');
      // At 15 seconds, second hand should be at 90 degrees
      expect(secondHand.getAttribute('transform')).to.equal('rotate(90, 50, 50)');
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(async () => {
      clock.value = '12:00:00';
      await nextFrame();
      clock.focus();
      clock._focused = true;
    });

    it('should increase time on ArrowUp', async () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      clock._onKeyDown(event);
      await nextFrame();
      // Default step is 60 seconds
      expect(clock.value).to.equal('12:01:00');
    });

    it('should decrease time on ArrowDown', async () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      clock._onKeyDown(event);
      await nextFrame();
      expect(clock.value).to.equal('11:59:00');
    });

    it('should not adjust time when not interactive', async () => {
      clock.adjustable = false;
      await nextFrame();
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      clock._onKeyDown(event);
      await nextFrame();
      expect(clock.value).to.equal('12:00:00');
    });
  });

  describe('Theme API', () => {
    it('should export ClockTheme constants', async () => {
      const { ClockTheme } = await import('../src/vaadin-clock.js');
      expect(ClockTheme.LUMO).to.equal('lumo');
      expect(ClockTheme.AURA).to.equal('aura');
      expect(ClockTheme.DARK).to.equal('dark');
    });

    it('should have Theme static property', () => {
      expect(clock.constructor.Theme).to.be.ok;
      expect(clock.constructor.Theme.LUMO).to.equal('lumo');
    });
  });

  describe('AM/PM indicators', () => {
    it('should show AM indicator as active for morning hours', async () => {
      clock.value = '09:00:00';
      await nextFrame();
      const sunIcon = clock.shadowRoot.querySelector('.sun-icon');
      expect(sunIcon.classList.contains('active')).to.be.true;
    });

    it('should show PM indicator as active for afternoon hours', async () => {
      clock.value = '15:00:00';
      await nextFrame();
      const moonIcon = clock.shadowRoot.querySelector('.moon-icon');
      expect(moonIcon.classList.contains('active')).to.be.true;
    });
  });

  describe('time wrapping', () => {
    it('should wrap from 23:59 to 00:00 when incrementing', async () => {
      clock.value = '23:59:00';
      await nextFrame();
      clock.focus();
      clock._focused = true;
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      clock._onKeyDown(event);
      await nextFrame();
      expect(clock.value).to.equal('00:00:00');
    });

    it('should wrap from 00:00 to 23:59 when decrementing', async () => {
      clock.value = '00:00:00';
      await nextFrame();
      clock.focus();
      clock._focused = true;
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      clock._onKeyDown(event);
      await nextFrame();
      expect(clock.value).to.equal('23:59:00');
    });
  });
});
