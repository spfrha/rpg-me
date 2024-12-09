import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "wired-elements";

export class RpgMe extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "rpg-me";
  }

  constructor() {
    super();
    this.addons = 0;
    this.base = 1;
    this.face = 0;
    this.faceItem = 0;
    this.hair = 0;
    this.bottom = 0;
    this.top = 0;
    this.skin = 0;
    this.hatColor = 0;
    this.hat = 'none';
    this.fire = false;
    this.moving = false;
    this.circle = false;
    this.updateSeed();
  }

  static get properties() {
    return {
      ...super.properties,
      addons: { type: Number },
      base: { type: Number },
      face: { type: Number },
      faceItem: { type: Number },
      hair: { type: Number },
      bottom: { type: Number },
      top: { type: Number },
      skin: { type: Number },
      hatColor: { type: Number },
      hat: { type: String },
      fire: { type: Boolean },
      moving: { type: Boolean },
      circle: { type: Boolean },
      seed: { type: String },
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
      }

      .wrapper {
        display: inline-flex;
      }

      .character-panel {
        background: var(--ddd-theme-default-aqua);
        padding: var(--ddd-spacing-4);
        width: 600px;
      }

      .controls-panel-1 {
        background: var(--ddd-theme-default-darkorange);
        padding: var(--ddd-spacing-4);
        width: 420px;
      }

      .controls-panel-2 {
        background: var(--ddd-theme-default-darkorange);
        width: 420px;
        justify-content: center;
      }

      wired-combo {
        background-color: var(--ddd-theme-default-ivory);
      }

      .input-group {
        margin-bottom: var(--ddd-spacing-4);
      }

      .input-group label {
        display: block;
        color: var(--ddd-theme-default-darkgreen);
      }
    `];
  }

  loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const seed = params.get('seed');
    if (seed && seed.length === 10) {
      this.seed = seed;
      this.addons = parseInt(seed[0]);
      this.base = parseInt(seed[1]);
      this.face = parseInt(seed[2]);
      this.faceItem = parseInt(seed[3]);
      this.hair = parseInt(seed[4]);
      this.bottom = parseInt(seed[5]);
      this.top = parseInt(seed[6]);
      this.skin = parseInt(seed[7]);
      this.hatColor = parseInt(seed[8]);
    }
    this.fire = params.get('fire') === 'true';
    this.moving = params.get('moving') === 'true';
    this.circle = params.get('circle') === 'true';
    if (params.get('hat')) {
      this.hat = params.get('hat');
    }
  }

  updateSeed() {
    this.seed = `${this.addons}${this.base}${this.face}${this.faceItem}${this.hair}${this.bottom}${this.top}${this.skin}${this.hatColor}`;
    this.updateUrl();
  }

  updateUrl() {
    const params = new URLSearchParams();
    params.set('seed', this.seed);
    params.set('hat', this.hat);
    if (this.fire) params.set('fire', 'true');
    if (this.moving) params.set('moving', 'true');
    if (this.circle) params.set('circle', 'true');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }

  handleInputChange(property, event) {
    let value;
    if (event.target.type === 'checkbox') {
      value = event.target.checked;
    } else if (event.detail?.selected !== undefined) {
      value = event.detail.selected;
    } else {
      value = parseInt(event.target.value);
    }

    this[property] = value;

    if (property !== 'hat' && property !== 'fire' && property !== 'moving' && property !== 'circle') {
      this.updateSeed();
    } else {
      this.updateUrl();
    }
    this.requestUpdate();
  }

  async shareCharacter() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard.');
    } catch (err) {
      alert('Share link: ' + url);
    }
  }

  firstUpdated() {
    super.firstUpdated();
    const baseCombo = this.shadowRoot.querySelector('#base');
    const hatCombo = this.shadowRoot.querySelector('#hat');
    if (baseCombo) baseCombo.value = this.base.toString();
    if (hatCombo) hatCombo.value = this.hat;
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="character-panel">
          <rpg-character
            .Addons="${this.addons}"
            .base="${this.base}"
            .Face="${this.face}"
            .faceItem="${this.faceItem}"
            .hair="${this.hair}"
            .Bottom="${this.bottom}"
            .Top="${this.top}"
            .skin="${this.skin}"
            .hatColor="${this.hatColor}"
            .hat="${this.hat}"
            ?fire="${this.fire}"
            ?moving="${this.moving}"
            ?circle="${this.circle}"
            height="400"
            width="400"
          ></rpg-character>
          <div class="seed-display">
            Character Seed: ${this.seed}
          </div>
        </div>

        <div class="controls-panel-1">
          <div class="input-group">
            <label for="base">Character Type</label>
            <wired-combo id="base" .value="${this.base}" @selected="${(e) => this.handleInputChange('base', e)}">
              <wired-item value="1">Male</wired-item>
              <wired-item value="5">Female</wired-item>
            </wired-combo>
          </div>

          <div class="input-group">
            <label for="addons">addons (0-9)</label>
            <wired-slider id="addons" min="0" max="9" .value="${this.addons}" @change="${(e) => this.handleInputChange('addons', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="face">Face (0-5)</label>
            <wired-slider id="face" min="0" max="5" .value="${this.face}" @change="${(e) => this.handleInputChange('face', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="faceItem">Face Item (0-9)</label>
            <wired-slider id="faceItem" min="0" max="9" .value="${this.faceitem}" @change="${(e) => this.handleInputChange('faceItem', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="hair">Hair Style (0-9)</label>
            <wired-slider id="hair" min="0" max="9" .value="${this.hair}" @change="${(e) => this.handleInputChange('hair', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="bottom">bottom (0-9)</label>
            <wired-slider id="bottom" min="0" max="9" .value="${this.bottom}" @change="${(e) => this.handleInputChange('bottom', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="top">top (0-9)</label>
            <wired-slider id="top" min="0" max="9" .value="${this.top}" @change="${(e) => this.handleInputChange('top', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="skin">Skin Tone (0-9)</label>
            <wired-slider id="skin" min="0" max="9" .value="${this.skin}" @change="${(e) => this.handleInputChange('skin', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>

          <div class="input-group">
            <label for="hatColor">Hat Color (0-9)</label>
            <wired-slider id="hatColor" min="0" max="9" .value="${this.hatColor}" @change="${(e) => this.handleInputChange('hatColor', { target: { value: parseInt(e.target.value) } })}"></wired-slider>
          </div>
        </div>
        <div class="controls-panel-2">
          <div class="input-group">
            <label for="hat">Hat Style</label>
            <wired-combo id="hat" .value="${this.hat}" @selected="${(e) => this.handleInputChange('hat', e)}">
              <wired-item value="none">None</wired-item>
              <wired-item value="bunny">Bunny</wired-item>
              <wired-item value="coffee">Coffee</wired-item>
              <wired-item value="construction">Construction</wired-item>
              <wired-item value="cowboy">Cowboy</wired-item>
              <wired-item value="education">Education</wired-item>
              <wired-item value="knight">Knight</wired-item>
              <wired-item value="ninja">Ninja</wired-item>
              <wired-item value="party">Party</wired-item>
              <wired-item value="pirate">Pirate</wired-item>
              <wired-item value="watermelon">Watermelon</wired-item>
            </wired-combo>
          </div>

          <div class="input-group">
            <wired-checkbox ?checked="${this.fire}" @change="${(e) => this.handleInputChange('fire', e)}">Lit On Fire</wired-checkbox>
          </div>

          <div class="input-group">
            <wired-checkbox ?checked="${this.moving}" @change="${(e) => this.handleInputChange('moving', e)}">Moving</wired-checkbox>
          </div>

          <div class="input-group">
            <wired-checkbox ?checked="${this.circle}" @change="${(e) => this.handleInputChange('circle', e)}">Display Circle</wired-checkbox>
          </div>

          <wired-button class="share-button" @click="${this.shareCharacter}">Share this Character Build Link</wired-button>
        </div>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(RpgMe.tag, RpgMe);
