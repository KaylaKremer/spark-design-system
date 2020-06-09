import {
  Component,
  HostListener,
  Input,
  Output,
  OnInit,
  ViewChild,
  EventEmitter
} from '@angular/core';
import { uniqueId } from 'lodash';

@Component({
  selector: 'sprk-tooltip',
  template: `
  <span class="sprk-c-Tooltip__container" #containerElement>
    <button
      class="sprk-c-Tooltip__trigger"
      [ngClass]="{
        'sprk-c-Tooltip__trigger' : true,
        'sprk-c-Tooltip--toggled' : isOpen
      }"
      [attr.aria-expanded]="isOpen ? 'true' : 'false'"
      [attr.data-analytics]="analyticsString"
      [attr.data-id]="idString"
      #triggerElement
    >
      <sprk-icon
        [iconType]="triggerIconType"
        [additionalClasses]="additionalClassesIcon"
        aria-hidden="true"
      ></sprk-icon>
    </button>
    <span
      [ngClass]="getTooltipClasses()"
      class="sprk-c-Tooltip"
      aria-hidden="true"
      role="tooltip"
      #tooltipElement
    >
      <ng-content></ng-content>
    </span>
  </span>
  `
})
export class SprkTooltipComponent implements OnInit {

  /**
   * The name of the icon to use
   */
  @Input()
  triggerIconType: string;
  /**
   * The value supplied will be assigned to the
   * `data-analytics` attribute on the component.
   * Intended for an outside
   * library to capture data.
   */
  @Input()
  analyticsString: string;
  /**
   * Expects a space separated string
   * of classes to be added to the
   * component container.
   */
  @Input()
  additionalClasses: string;
  /**
   * Expects a space separated string
   * of classes to be added to the
   * svg icon.
   */
  @Input()
  additionalClassesIcon: string;
  /**
   * The value supplied will be assigned
   * to the `data-id` attribute on the
   * component. This is intended to be
   * used as a selector for automated
   * tools. This value should be unique
   * per page.
   */
  @Input()
  idString: string;
  /**
  * Optional: the unique ID to use for the tooltip element
  */
  @Input()
  id: string = uniqueId(`sprk_tooltip_`);

  /**
   * Emitted when the tooltip is toggled open
   */
  @Output()
  openedEvent = new EventEmitter<any>();

  /**
   * Emitted when the tooltip is toggled closed
   */
  @Output()
  closedEvent = new EventEmitter<any>();

  @ViewChild('triggerElement') triggerElement;
  @ViewChild('tooltipElement') tooltipElement;
  @ViewChild('containerElement') containerElement;

  /**
   * @ignore
   */
  @HostListener('document:keydown', ['$event'])
  onKeydown($event) {
    if ($event.key === 'Escape' || $event.key === 'Esc' || $event.keyCode === 27) {
      if (this.isOpen) {
        this.isOpen = false;
        this.closedEvent.emit();
      }
    }
  }

  /**
   * @ignore
   */
  @HostListener('document:click', ['$event']) onDocumentClick(event): void {
    if (!this.containerElement.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
        this.closedEvent.emit();
      }
    }
  }

  /**
   * @ignore
   */
  @HostListener('focusin') onFocusIn() {
    this.positioningClass = this.calculatePositioningClass();
  }

  /**
   * @ignore
   */
  @HostListener('mouseover') onMouseOver() {
    this.positioningClass = this.calculatePositioningClass();
  }

  /**
   * @ignore
   */
  @HostListener('click', ['$event']) onClick(event) {
    if (this.triggerElement && this.triggerElement.nativeElement.contains(event.target)) {
      this.toggle()
    }
  }

  /**
   * @ignore
   */
  public isOpen = false;
  /**
   * @ignore
   */
  public positioningClass = 'sprk-c-Tooltip--bottom-right';

  /**
   * @ignore
   */
  calculatePositioningClass(): string {
    // for virtual DOM environments like unit tests
    if (this.triggerElement === undefined) return 'sprk-c-Tooltip--bottom-right';

    var trigger = this.triggerElement.nativeElement;

    const elemX = trigger.getBoundingClientRect().left;
    const elemY = trigger.getBoundingClientRect().top;

    let viewportWidth = 0;
    let viewportHeight = 0;

    if (window) {
      viewportWidth = window.innerWidth ? window.innerWidth : 0;
      viewportHeight = window.innerHeight ? window.innerHeight : 0;
    }

    if (elemX > viewportWidth / 2) {
      if (elemY > viewportHeight / 2) {
        return 'sprk-c-Tooltip--top-left';
      } else {
        return 'sprk-c-Tooltip--bottom-left';
      }
    } else {
      if (elemY > viewportHeight / 2) {
        return 'sprk-c-Tooltip--top-right';
      } else {
        return 'sprk-c-Tooltip--bottom-right';
      }
    }
  };

  /**
   * @ignore
   */
  toggle(): void {
    this.positioningClass = this.calculatePositioningClass();
    this.isOpen = !this.isOpen;

    if (this.isOpen)
      this.openedEvent.emit();
    else
      this.closedEvent.emit();
  }

  /**
   * @ignore
   */
  getTooltipClasses(): string {
    const classArray: string[] = [
      'sprk-c-Tooltip',
      this.positioningClass,
    ];

    if (this.additionalClasses) {
      this.additionalClasses.split(' ').forEach(className => {
        classArray.push(className);
      });
    }

    return classArray.join(' ');
  }

  ngOnInit() {
    if (this.triggerElement && this.tooltipElement) {
      this.triggerElement.nativeElement.setAttribute('aria-labelledby', this.id);
      this.tooltipElement.nativeElement.id = this.id;
    }

    this.positioningClass = this.calculatePositioningClass();
  }
}
