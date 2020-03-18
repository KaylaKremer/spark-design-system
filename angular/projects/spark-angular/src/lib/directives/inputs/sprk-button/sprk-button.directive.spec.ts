import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SprkButtonDirective } from './sprk-button.directive';

@Component({
  selector: 'sprk-test',
  template: `
    <button sprkButton>Test 1</button>
    <button sprkButton [isSpinning]="true">Test 2</button>
    <button
      sprkButton
      variant="secondary"
      analyticsString="test"
      idString="id-test"
      [isSpinning]="spinnerVal">
      Test 3
    </button>
    <button class="sprk-c-Button--tertiary" sprkButton>Test 4</button>
  `
})
class TestComponent {
 spinnerVal = false;
}

describe('Spark Button Directive', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let button1Element: HTMLElement;
  let button2Element: HTMLElement;
  let button3Element: HTMLElement;
  let button4Element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SprkButtonDirective, TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    button1Element = fixture.nativeElement.querySelectorAll('button')[0];
    button2Element = fixture.nativeElement.querySelectorAll('button')[1];
    button3Element = fixture.nativeElement.querySelectorAll('button')[2];
    button4Element = fixture.nativeElement.querySelectorAll('button')[3];
  }));

  it('should create itself', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a spinner if isSpinning is true', () => {
    expect(button2Element.querySelectorAll('.sprk-c-Spinner').length).toBe(1);
  });

  it('should add the dark spinner class when isSpinning is true on a secondary button', () => {
    component.spinnerVal = true;
    fixture.detectChanges();
    const spinner = button3Element.querySelector('.sprk-c-Spinner');
    expect(spinner.classList.contains('sprk-c-Spinner--dark')).toBe(true);
  });

  it('should add the value of analyticsString to data-analytics', () => {
    expect(button3Element.getAttribute('data-analytics')).toBe('test');
  });

  it('should add the value of idString to data-id', () => {
    expect(button3Element.getAttribute('data-id')).toBe('id-test');
  });

  // This test makes sure the new variant @Input isn't a breaking change
  it('should still add the correct button class if variant is not used', () => {
    expect(button4Element.classList.contains('sprk-c-Button')).toBe(true);
    expect(button4Element.classList.contains('sprk-c-Button--tertiary')).toBe(true);
  });

  it('should fire setSpinning if isSpinning input is changed after first load', () => {
    const spinnerEl = button3Element.querySelector('.sprk-c-Spinner');
    expect(spinnerEl).toBeNull();
    component.spinnerVal = true;
    fixture.detectChanges();
    const spinner = button3Element.querySelector('.sprk-c-Spinner');
    expect(spinner).toBeTruthy();
  });
});
