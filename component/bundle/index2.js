const P = class {
  static capitalize(a) {
    return a.replace(P.FIRST_CHAR_REGEX, (t) => t.toUpperCase());
  }
  static lineBreak(a) {
    return a.replace(P.DOUBLE_LINE, "<p></p>").replace(P.ONE_LINE, "<br>");
  }
  static isCharDefined(a) {
    return a !== void 0 && a !== " " && a !== " " && a !== `
` && a !== "";
  }
  // WORK - can optimize to not not have to do it multiple times
  static breakupIntoWordsArr(a) {
    return a.split(/(\W+)/);
  }
};
let l = P;
l.FIRST_CHAR_REGEX = /\S/;
l.DOUBLE_LINE = /\n\n/g;
l.ONE_LINE = /\n/g;
class O {
  static translate(t, e) {
    const i = l.breakupIntoWordsArr(t);
    for (let r = 0; r < i.length; r += 1)
      e[i[r]] && (i[r] = e[i[r]]);
    return i.join("");
  }
}
class y {
  static extract(t, e, i) {
    let r = "";
    for (let n = t.resultIndex; n < t.results.length; ++n) {
      let s = t.results[n][0].transcript;
      i && (s = O.translate(s, i)), t.results[n].isFinal ? e += s : r += s;
    }
    return { interimTranscript: r, finalTranscript: e, newText: r || e };
  }
  static extractSafari(t, e, i) {
    let r = "";
    const n = "";
    for (let s = t.resultIndex; s < t.results.length; ++s) {
      let o = t.results[s][0].transcript;
      i && (o = O.translate(o, i)), r += o;
    }
    return { interimTranscript: n, finalTranscript: r, newText: n || r };
  }
}
const x = class {
};
let T = x;
T.IS_SAFARI = () => (x._IS_SAFARI === void 0 && (x._IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)), x._IS_SAFARI);
const g = class {
  static getElementIfFocusedOnAvailable(a, t) {
    return Array.isArray(a) ? a.find((e) => t === e) : t === a ? a : void 0;
  }
  static keyDownWindow(a) {
    a.element && g.getElementIfFocusedOnAvailable(a.element, document.activeElement) && (g.KEY_DOWN_TIMEOUT !== null && clearTimeout(g.KEY_DOWN_TIMEOUT), g.KEY_DOWN_TIMEOUT = setTimeout(() => {
      g.KEY_DOWN_TIMEOUT = null, this.resetRecording(a);
    }, 500));
  }
  static mouseDownWindow(a, t) {
    this.mouseDownElement = g.getElementIfFocusedOnAvailable(a, t.target);
  }
  static mouseUpWindow(a) {
    this.mouseDownElement && this.resetRecording(a), this.mouseDownElement = void 0;
  }
  static add(a, t) {
    const e = (t == null ? void 0 : t.insertInCursorLocation) === void 0 || (t == null ? void 0 : t.insertInCursorLocation);
    t != null && t.element && e && (a.mouseDownEvent = g.mouseDownWindow.bind(a, t.element), document.addEventListener("mousedown", a.mouseDownEvent), a.mouseUpEvent = g.mouseUpWindow.bind(a, t), document.addEventListener("mouseup", a.mouseUpEvent), a.keyDownEvent = g.keyDownWindow.bind(a, t), document.addEventListener("keydown", a.keyDownEvent));
  }
  static remove(a) {
    document.removeEventListener("mousedown", a.mouseDownEvent), document.removeEventListener("mouseup", a.mouseUpEvent), document.removeEventListener("keydown", a.keyDownEvent);
  }
};
let b = g;
b.KEY_DOWN_TIMEOUT = null;
class D {
  static process(t, e, i, r, n) {
    const s = r == null ? void 0 : r(e, i);
    return s ? (setTimeout(() => {
      s.restart ? t.resetRecording(n) : s.stop && t.stop();
    }), (s.stop || s.restart) && s.removeNewText) : !1;
  }
}
class m {
  static changeStateIfNeeded(t, e) {
    e && !t.isCursorAtEnd && (t.endPadding = "", t.scrollingSpan.innerHTML = "&nbsp;");
  }
  static scrollGeneric(t, e) {
    t.isCursorAtEnd ? e.scrollTop = e.scrollHeight : t.scrollingSpan.scrollIntoView({ block: "nearest" });
  }
  // primitives don't need to be scrolled except in safari
  // they can only safely be scrolled to the end
  static scrollSafariPrimitiveToEnd(t) {
    t.scrollLeft = t.scrollWidth, t.scrollTop = t.scrollHeight;
  }
  static isElementOverflown(t) {
    return t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth;
  }
  static isRequired(t, e) {
    return t && m.isElementOverflown(e);
  }
}
class f {
  static isPrimitiveElement(t) {
    return t.tagName === "INPUT" || t.tagName === "TEXTAREA";
  }
  static createInterimSpan() {
    const t = document.createElement("span");
    return t.style.color = "grey", t.style.pointerEvents = "none", t;
  }
  static createGenericSpan() {
    const t = document.createElement("span");
    return t.style.pointerEvents = "none", t;
  }
  static appendSpans(t, e) {
    if (t.spansPopulated = !0, t.insertInCursorLocation && document.activeElement === e) {
      const i = window.getSelection();
      if (i != null && i.focusNode) {
        const r = i.getRangeAt(0);
        r.insertNode(t.scrollingSpan), r.insertNode(t.interimSpan), r.insertNode(t.finalSpan), r.collapse(!1), i.removeAllRanges(), i.addRange(r);
        return;
      }
    }
    e.appendChild(t.finalSpan), e.appendChild(t.interimSpan), e.appendChild(t.scrollingSpan);
  }
  static applyCustomColors(t, e) {
    e.interim && (t.interimSpan.style.color = e.interim), e.final && (t.finalSpan.style.color = e.final);
  }
}
class d {
  static setOffsetForGeneric(t, e, i = 0) {
    let r = 0;
    for (let n = 0; n < t.childNodes.length; n += 1) {
      const s = t.childNodes[n];
      if (s.childNodes.length > 0) {
        const o = d.setOffsetForGeneric(s, e, i);
        if (o === -1)
          return -1;
        i += o;
      } else if (s.textContent !== null) {
        if (i + s.textContent.length > e) {
          const o = document.createRange();
          o.setStart(s, e - i), o.collapse(!0);
          const c = window.getSelection();
          return c == null || c.removeAllRanges(), c == null || c.addRange(o), t.focus(), -1;
        }
        i += s.textContent.length, r += s.textContent.length;
      }
    }
    return r;
  }
  static focusEndOfGeneric(t) {
    const e = document.createRange();
    e.selectNodeContents(t), e.collapse(!1);
    const i = window.getSelection();
    i && (i.removeAllRanges(), i.addRange(e));
  }
  static setOffsetForSafariGeneric(t, e) {
    const i = window.getSelection();
    if (i) {
      const r = d.getGenericElementCursorOffset(t, i, !0);
      console.log(r), setTimeout(() => {
      }, 100), d.setOffsetForGeneric(t, r + e);
    }
  }
  // set to automatically scroll to cursor (scroll does not work in Safari)
  static setOffsetForPrimitive(t, e, i) {
    i && t.blur(), t.setSelectionRange(e, e), t.focus();
  }
  // Scroll Input in Safari - does not work for TextArea and uses span which can have a different style
  // private static getCursorOffsetFromLeft(inputElement: HTMLInputElement, position: number) {
  //   // Get the value of the input element up to the cursor position
  //   const valueUpToCursor = inputElement.value.substring(0, position);
  //   // Create a temporary span element to measure the width of the text
  //   const tempSpan = document.createElement('span');
  //   tempSpan.textContent = valueUpToCursor;
  //   tempSpan.style.visibility = 'hidden';
  //   tempSpan.style.position = 'absolute';
  //   document.body.appendChild(tempSpan);
  //   // Measure the width of the text up to the cursor position
  //   const offsetWidth = tempSpan.offsetWidth;
  //   const offsetHeight = tempSpan.offsetHeight;
  //   // Clean up the temporary span element
  //   document.body.removeChild(tempSpan);
  //   return {left: offsetWidth, top: offsetHeight};
  // }
  static getGenericElementCursorOffset(t, e, i) {
    let r = 0;
    if (e.rangeCount > 0) {
      const n = e.getRangeAt(0), s = n.cloneRange();
      s.selectNodeContents(t), i ? s.setEnd(n.startContainer, n.startOffset) : s.setEnd(n.endContainer, n.endOffset), r = s.toString().length;
    }
    return r;
  }
  // for input
  // private static insertTextAtCursor(text: string, input: HTMLInputElement) {
  //   const startPos = input.selectionStart;
  //   const endPos = input.selectionEnd;
  //   if (startPos !== null && endPos !== null) {
  //     input.value = input.value.substring(0, startPos) + text + input.value.substring(endPos);
  //     input.selectionStart = input.selectionEnd = startPos + text.length;
  //   }
  // }
}
class u {
  static processCommand(t, e) {
    return (!e || !e.caseSensitive) && (t = t.toLowerCase()), (e == null ? void 0 : e.substrings) === !1 ? l.breakupIntoWordsArr(t) : t;
  }
  static process(t) {
    var i;
    return ((i = t.settings) == null ? void 0 : i.caseSensitive) === !0 ? t : Object.keys(t).reduce((r, n) => {
      const s = t[n];
      return r[n] = typeof s == "string" ? u.processCommand(s, t.settings) : s, r;
    }, {});
  }
  static toggleCommandModeOn(t) {
    var e;
    t.isWaitingForCommand = !0, (e = t.onCommandModeTrigger) == null || e.call(t, !0);
  }
  static toggleCommandModeOff(t) {
    var e;
    t.isWaitingForCommand && ((e = t.onCommandModeTrigger) == null || e.call(t, !1), t.isWaitingForCommand = !1);
  }
  static setText(t, e, i, r) {
    u.toggleCommandModeOff(t), f.isPrimitiveElement(r) ? (r.value = i, d.setOffsetForPrimitive(r, i.length, !0), T.IS_SAFARI() && t.autoScroll && m.scrollSafariPrimitiveToEnd(r)) : (r.textContent = i, d.focusEndOfGeneric(r), setTimeout(() => m.scrollGeneric(t, r))), t.resetRecording(e);
  }
  static checkIfMatchesSubstring(t, e) {
    return e.includes(t);
  }
  static checkIfMatchesWord(t, e, i) {
    const r = t;
    for (let n = i.length - 1; n >= 0; n -= 1) {
      let s = n, o = r.length - 1;
      for (; i[s] === r[o] && o >= 0; )
        s -= 1, o -= 1;
      if (o < 0)
        return !0;
    }
    return !1;
  }
  // prettier-ignore
  static execCommand(t, e, i, r, n) {
    var _, C, k;
    const s = t.commands;
    if (!s || !r || !i)
      return;
    const o = ((_ = s.settings) == null ? void 0 : _.caseSensitive) === !0 ? e : e.toLowerCase(), c = l.breakupIntoWordsArr(o), h = ((C = s.settings) == null ? void 0 : C.substrings) === !1 ? u.checkIfMatchesWord : u.checkIfMatchesSubstring;
    if (s.commandMode && h(s.commandMode, o, c))
      return t.setInterimColorToFinal(), setTimeout(() => u.toggleCommandModeOn(t)), { doNotProcessTranscription: !1 };
    if (!(s.commandMode && !t.isWaitingForCommand)) {
      if (s.stop && h(s.stop, o, c))
        return u.toggleCommandModeOff(t), setTimeout(() => t.stop()), { doNotProcessTranscription: !1 };
      if (s.pause && h(s.pause, o, c))
        return u.toggleCommandModeOff(t), t.setInterimColorToFinal(), setTimeout(() => {
          var p;
          t.isPaused = !0, (p = t.onPauseTrigger) == null || p.call(t, !0);
        }), { doNotProcessTranscription: !1 };
      if (s.resume && h(s.resume, o, c))
        return t.isPaused = !1, (k = t.onPauseTrigger) == null || k.call(t, !1), u.toggleCommandModeOff(t), t.resetRecording(i), { doNotProcessTranscription: !0 };
      if (s.reset && h(s.reset, o, c))
        return n !== void 0 && u.setText(t, i, n, r), { doNotProcessTranscription: !0 };
      if (s.removeAllText && h(s.removeAllText, o, c))
        return u.setText(t, i, "", r), { doNotProcessTranscription: !0 };
    }
  }
}
const F = class {
  // 20s
  static set(a) {
    a.stopTimeout = setTimeout(() => a.stop(), a.stopTimeoutMS);
  }
  static reset(a, t) {
    a.stopTimeoutMS = t || F.DEFAULT_MS, a.stopTimeout && clearTimeout(a.stopTimeout), F.set(a);
  }
};
let N = F;
N.DEFAULT_MS = 2e4;
class v {
  static setStateForPrimitive(t, e) {
    let i, r;
    e.selectionStart !== null && (i = e.selectionStart), e.selectionEnd !== null && (r = e.selectionEnd), t.isHighlighted = i !== r;
  }
  static setStateForGeneric(t, e) {
    const i = window.getSelection();
    if (i != null && i.focusNode) {
      const r = d.getGenericElementCursorOffset(e, i, !0), n = d.getGenericElementCursorOffset(e, i, !1);
      t.isHighlighted = r !== n;
    }
  }
  static setState(t, e) {
    document.activeElement === e && (f.isPrimitiveElement(e) ? v.setStateForPrimitive(t, e) : v.setStateForGeneric(t, e));
  }
  static removeForGeneric(t, e) {
    const i = window.getSelection();
    if (i) {
      const r = d.getGenericElementCursorOffset(e, i, !0);
      i.deleteFromDocument(), d.setOffsetForGeneric(e, r), t.isHighlighted = !1;
    }
  }
  static removeForPrimitive(t, e) {
    const i = e.selectionStart, r = e.selectionEnd, n = e.value;
    if (i && r) {
      const s = n.substring(0, i) + n.substring(r);
      e.value = s, d.setOffsetForPrimitive(e, i, t.autoScroll);
    }
    t.isHighlighted = !1;
  }
}
class E {
  static setStateForPrimitiveElement(t, e) {
    if (document.activeElement === e && e.selectionStart !== null) {
      const r = e.selectionStart, n = e.value[r - 1], s = e.selectionEnd === null ? r : e.selectionEnd, o = e.value[s];
      l.isCharDefined(n) && (t.startPadding = " ", t.numberOfSpacesBeforeNewText = 1), l.isCharDefined(o) && (t.endPadding = " ", t.numberOfSpacesAfterNewText = 1), t.isCursorAtEnd = e.value.length === s;
      return;
    }
    const i = e.value[e.value.length - 1];
    l.isCharDefined(i) && (t.startPadding = " ", t.numberOfSpacesBeforeNewText = 1), t.isCursorAtEnd = !0;
  }
  static setStateForGenericElement(t, e) {
    var r, n, s;
    if (document.activeElement === e) {
      const o = window.getSelection();
      if (o != null && o.focusNode) {
        const c = d.getGenericElementCursorOffset(e, o, !0), h = (r = e.textContent) == null ? void 0 : r[c - 1], _ = d.getGenericElementCursorOffset(e, o, !1), C = (n = e.textContent) == null ? void 0 : n[_];
        l.isCharDefined(h) && (t.startPadding = " "), l.isCharDefined(C) && (t.endPadding = " "), t.isCursorAtEnd = ((s = e.textContent) == null ? void 0 : s.length) === _;
        return;
      }
    }
    const i = e.innerText.charAt(e.innerText.length - 1);
    l.isCharDefined(i) && (t.startPadding = " "), t.isCursorAtEnd = !0;
  }
  static setState(t, e) {
    f.isPrimitiveElement(e) ? E.setStateForPrimitiveElement(t, e) : E.setStateForGenericElement(t, e);
  }
  static adjustStateAfterRecodingPrimitiveElement(t, e) {
    if (t.primitiveTextRecorded = !0, t.insertInCursorLocation && document.activeElement === e && (e.selectionEnd !== null && (t.endPadding = t.endPadding + e.value.slice(e.selectionEnd)), e.selectionStart !== null)) {
      t.startPadding = e.value.slice(0, e.selectionStart) + t.startPadding;
      return;
    }
    t.startPadding = e.value + t.startPadding;
  }
  static adjustSateForNoTextPrimitiveElement(t) {
    t.numberOfSpacesBeforeNewText === 1 && (t.startPadding = t.startPadding.substring(0, t.startPadding.length - 1), t.numberOfSpacesBeforeNewText = 0), t.numberOfSpacesAfterNewText === 1 && (t.endPadding = t.endPadding.substring(1), t.numberOfSpacesAfterNewText = 0);
  }
}
class M {
  constructor() {
    this.finalTranscript = "", this.interimSpan = f.createInterimSpan(), this.finalSpan = f.createGenericSpan(), this.scrollingSpan = f.createGenericSpan(), this.isCursorAtEnd = !1, this.spansPopulated = !1, this.startPadding = "", this.endPadding = "", this.numberOfSpacesBeforeNewText = 0, this.numberOfSpacesAfterNewText = 0, this.isHighlighted = !1, this.primitiveTextRecorded = !1, this.recognizing = !1, this._displayInterimResults = !0, this.insertInCursorLocation = !0, this.autoScroll = !0, this.isRestarting = !1, this.isPaused = !1, this.isWaitingForCommand = !1, this.resetState();
  }
  prepareBeforeStart(t) {
    var e, i;
    if (t != null && t.element)
      if (b.add(this, t), Array.isArray(t.element)) {
        const n = t.element.find((s) => s === document.activeElement) || t.element[0];
        if (!n)
          return;
        this.prepare(n);
      } else
        this.prepare(t.element);
    (t == null ? void 0 : t.displayInterimResults) !== void 0 && (this._displayInterimResults = t.displayInterimResults), t != null && t.textColor && (this._finalTextColor = (e = t == null ? void 0 : t.textColor) == null ? void 0 : e.final, f.applyCustomColors(this, t.textColor)), this.stopTimeout === void 0 && N.reset(this, t == null ? void 0 : t.stopAfterSilenceMs), (t == null ? void 0 : t.insertInCursorLocation) !== void 0 && (this.insertInCursorLocation = t.insertInCursorLocation), (t == null ? void 0 : t.autoScroll) !== void 0 && (this.autoScroll = t.autoScroll), this._onResult = t == null ? void 0 : t.onResult, this._onPreResult = t == null ? void 0 : t.onPreResult, this._onStart = t == null ? void 0 : t.onStart, this._onStop = t == null ? void 0 : t.onStop, this._onError = t == null ? void 0 : t.onError, this.onCommandModeTrigger = t == null ? void 0 : t.onCommandModeTrigger, this.onPauseTrigger = t == null ? void 0 : t.onPauseTrigger, this._options = t, (i = this._options) != null && i.commands && (this.commands = u.process(this._options.commands));
  }
  prepare(t) {
    E.setState(this, t), v.setState(this, t), f.isPrimitiveElement(t) ? (this._primitiveElement = t, this._originalText = this._primitiveElement.value) : (this._genericElement = t, this._originalText = this._genericElement.textContent);
  }
  // there was an attempt to optimize this by not having to restart the service and just reset state:
  // unfortunately it did not work because the service would still continue firing the intermediate and final results
  // into the new position
  resetRecording(t) {
    this.isRestarting = !0, this.stop(!0), this.resetState(!0), this.start(t);
  }
  // prettier-ignore
  updateElements(t, e, i) {
    var o;
    const r = l.capitalize(e);
    if (this.finalTranscript === r && t === "")
      return;
    D.process(this, i, t === "", this._onPreResult, this._options) && (t = "", i = "");
    const n = this.commands && u.execCommand(
      this,
      i,
      this._options,
      this._primitiveElement || this._genericElement,
      this._originalText
    );
    if (n) {
      if (n.doNotProcessTranscription)
        return;
      t = "", i = "";
    }
    if (this.isPaused || this.isWaitingForCommand)
      return;
    (o = this._onResult) == null || o.call(this, i, t === ""), N.reset(this, this.stopTimeoutMS), this.finalTranscript = r, this._displayInterimResults || (t = "");
    const s = this.finalTranscript === "" && t === "";
    this._primitiveElement ? this.updatePrimitiveElement(this._primitiveElement, t, s) : this._genericElement && this.updateGenericElement(this._genericElement, t, s);
  }
  // prettier-ignore
  // remember that padding values here contain actual text left and right
  updatePrimitiveElement(t, e, i) {
    this.isHighlighted && v.removeForPrimitive(this, t), this.primitiveTextRecorded || E.adjustStateAfterRecodingPrimitiveElement(this, t), i && E.adjustSateForNoTextPrimitiveElement(this);
    const r = this.startPadding + this.finalTranscript + e;
    t.value = r + this.endPadding, d.setOffsetForPrimitive(t, r.length + this.numberOfSpacesAfterNewText, this.autoScroll), this.autoScroll && T.IS_SAFARI() && this.isCursorAtEnd && m.scrollSafariPrimitiveToEnd(t);
  }
  updateGenericElement(t, e, i) {
    this.isHighlighted && v.removeForGeneric(this, t), this.spansPopulated || f.appendSpans(this, t);
    const r = (i ? "" : this.startPadding) + l.lineBreak(this.finalTranscript);
    this.finalSpan.innerHTML = r;
    const n = m.isRequired(this.autoScroll, t);
    m.changeStateIfNeeded(this, n);
    const s = l.lineBreak(e) + (i ? "" : this.endPadding);
    this.interimSpan.innerHTML = s, T.IS_SAFARI() && this.insertInCursorLocation && d.setOffsetForSafariGeneric(t, r.length + s.length), n && m.scrollGeneric(this, t), i && (this.scrollingSpan.innerHTML = "");
  }
  finalise(t) {
    this._genericElement && (t ? (this.finalSpan = f.createGenericSpan(), this.setInterimColorToFinal(), this.interimSpan = f.createInterimSpan(), this.scrollingSpan = f.createGenericSpan()) : this._genericElement.textContent = this._genericElement.textContent, this.spansPopulated = !1), b.remove(this);
  }
  setInterimColorToFinal() {
    this.interimSpan.style.color = this._finalTextColor || "black";
  }
  resetState(t) {
    this._primitiveElement = void 0, this._genericElement = void 0, this.finalTranscript = "", this.finalSpan.innerHTML = "", this.interimSpan.innerHTML = "", this.scrollingSpan.innerHTML = "", this.startPadding = "", this.endPadding = "", this.isHighlighted = !1, this.primitiveTextRecorded = !1, this.numberOfSpacesBeforeNewText = 0, this.numberOfSpacesAfterNewText = 0, t || (this.stopTimeout = void 0);
  }
  setStateOnStart() {
    var t;
    this.recognizing = !0, this.isRestarting ? this.isRestarting = !1 : (t = this._onStart) == null || t.call(this);
  }
  setStateOnStop() {
    var t;
    this.recognizing = !1, this.isRestarting || (t = this._onStop) == null || t.call(this);
  }
  setStateOnError(t) {
    var e;
    (e = this._onError) == null || e.call(this, t), this.recognizing = !1;
  }
}
class I extends M {
  constructor() {
    super();
  }
  start(t) {
    var e;
    this._extractText === void 0 && (this._extractText = T.IS_SAFARI() ? y.extractSafari : y.extract), this.validate() && (this.prepareBeforeStart(t), this.instantiateService(t), (e = this._service) == null || e.start(), this._translations = t == null ? void 0 : t.translations);
  }
  validate() {
    return I.getAPI() ? !0 : (this.error("Speech Recognition is unsupported"), !1);
  }
  instantiateService(t) {
    const e = I.getAPI();
    this._service = new e(), this._service.continuous = !0, this._service.interimResults = (t == null ? void 0 : t.displayInterimResults) ?? !0, this._service.lang = (t == null ? void 0 : t.language) || "en-US", this.setEvents();
  }
  setEvents() {
    this._service && (this._service.onstart = () => {
      this.setStateOnStart();
    }, this._service.onerror = (t) => {
      T.IS_SAFARI() && t.message === "Another request is started" || t.error === "aborted" && this.isRestarting || this.error(t.message || t.error);
    }, this._service.onaudioend = () => {
      this.setStateOnStop();
    }, this._service.onend = () => {
      this._stopping = !1;
    }, this._service.onresult = (t) => {
      if (typeof t.results > "u" && this._service)
        this._service.onend = null, this._service.stop();
      else if (this._extractText && !this._stopping) {
        const { interimTranscript: e, finalTranscript: i, newText: r } = this._extractText(
          t,
          this.finalTranscript,
          this._translations
        );
        this.updateElements(e, i, r);
      }
    });
  }
  stop(t) {
    var e;
    this._stopping = !0, (e = this._service) == null || e.stop(), this.finalise(t);
  }
  static getAPI() {
    return window.webkitSpeechRecognition || window.SpeechRecognition;
  }
  error(t) {
    console.error(t), this.setStateOnError(t);
  }
}
const A = "https://github.com/OvidijusParsiunas/speech-to-element";
class w {
  static validateOptions(t, e) {
    return e ? !e.subscriptionKey && !e.token && !e.retrieveToken ? (t(`Please define a 'subscriptionKey', 'token' or 'retrieveToken' property - more info: ${A}`), !1) : e.region ? !0 : (t(`Please define a 'region' property - more info: ${A}`), !1) : (t(`Please provide subscription details - more info: ${A}`), !1);
  }
  static async getNewSpeechConfig(t, e) {
    if (e.region)
      return e.subscriptionKey ? t.fromSubscription(e.subscriptionKey, e.region) : e.token ? t.fromAuthorizationToken(e.token, e.region) : e.retrieveToken ? e.retrieveToken().then((i) => e.region ? t.fromAuthorizationToken(i || "", e.region) : null) : null;
  }
  static process(t, e) {
    e.language && (t.speechRecognitionLanguage = e.language);
  }
  static async get(t, e) {
    const i = await w.getNewSpeechConfig(t, e);
    return i && w.process(i, e), i;
  }
}
class L {
  // newText is used to only send new text in onResult as finalTranscript is continuously accumulated
  static extract(t, e, i, r) {
    return r && (t = O.translate(t, r)), i ? { interimTranscript: "", finalTranscript: e + t, newText: t } : { interimTranscript: t, finalTranscript: e, newText: t };
  }
}
class R extends M {
  constructor() {
    super(...arguments), this._newTextPadding = "";
  }
  // Unlike webspeech there is no automatic space between final results
  start(t) {
    this._newTextPadding = "", this.prepareBeforeStart(t), this.startAsync(t);
  }
  async startAsync(t) {
    var e;
    this.validate(t) && (await this.instantiateService(t), this._translations = t == null ? void 0 : t.translations, (e = this._service) == null || e.startContinuousRecognitionAsync(() => {
    }, this.error));
  }
  validate(t) {
    return R.getAPI() ? w.validateOptions(this.error.bind(this), t) : (this.moduleNotFound(), !1);
  }
  async instantiateService(t) {
    const e = R.getAPI(), i = e.AudioConfig.fromDefaultMicrophoneInput(), r = await w.get(e.SpeechConfig, t);
    if (r) {
      const n = new e.SpeechRecognizer(r, i);
      this.setEvents(n), this._service = n, t.retrieveToken && this.retrieveTokenInterval(t.retrieveToken);
    }
  }
  setEvents(t) {
    t.recognizing = this.onRecognizing.bind(this), t.recognized = this.onRecognized.bind(this), t.sessionStarted = this.onSessionStarted.bind(this), t.canceled = this.onCanceled.bind(this), t.sessionStopped = this.onSessionStopped.bind(this);
  }
  // prettier-ignore
  onRecognizing(t, e) {
    if (this._stopping)
      return;
    const { interimTranscript: i, finalTranscript: r, newText: n } = L.extract(
      this._newTextPadding + e.result.text,
      this.finalTranscript,
      !1,
      this._translations
    );
    this.updateElements(i, r, n);
  }
  // WORK - huge opportunity to fix this in the repo!!!!!
  //   function onRecognized(sender, recognitionEventArgs) {
  //     var result = recognitionEventArgs.result;
  //     onRecognizedResult(recognitionEventArgs.result);
  // }
  // prettier-ignore
  onRecognized(t, e) {
    const i = e.result;
    switch (i.reason) {
      case window.SpeechSDK.ResultReason.Canceled:
        break;
      case window.SpeechSDK.ResultReason.RecognizedSpeech:
        if (i.text && !this._stopping) {
          const { interimTranscript: r, finalTranscript: n, newText: s } = L.extract(
            this._newTextPadding + i.text,
            this.finalTranscript,
            !0,
            this._translations
          );
          this.updateElements(r, n, s), n !== "" && (this._newTextPadding = " ");
        }
        break;
    }
  }
  onCanceled(t, e) {
    e.reason === window.SpeechSDK.CancellationReason.Error && this.error(e.errorDetails);
  }
  onSessionStarted() {
    this.setStateOnStart();
  }
  onSessionStopped() {
    this._retrieveTokenInterval || clearInterval(this._retrieveTokenInterval), this._stopping = !1, this.setStateOnStop();
  }
  retrieveTokenInterval(t) {
    this._retrieveTokenInterval = setInterval(() => {
      t == null || t().then((e) => {
        this._service && (this._service.authorizationToken = e || "");
      }).catch((e) => {
        this.error(e);
      });
    }, 1e4);
  }
  stop(t) {
    var e;
    !t && this._retrieveTokenInterval && clearInterval(this._retrieveTokenInterval), this._stopping = !0, (e = this._service) == null || e.stopContinuousRecognitionAsync(), this.finalise(t);
  }
  static getAPI() {
    return window.SpeechSDK;
  }
  moduleNotFound() {
    console.error("speech recognition module not found:"), console.error(
      `please install the 'microsoft-cognitiveservices-speech-sdk' npm package or add a script tag: <script src="https://aka.ms/csspeech/jsbrowserpackageraw"><\/script>`
    ), this.setStateOnError("speech recognition module not found");
  }
  error(t) {
    this._retrieveTokenInterval && clearInterval(this._retrieveTokenInterval), console.error(t), this.setStateOnError(t);
  }
}
class S {
  static toggle(t, e) {
    var r;
    const i = t.toLocaleLowerCase().trim();
    (r = this._service) != null && r.recognizing ? this._service.stop() : i === "webspeech" ? S.startWebSpeech(e) : i === "azure" ? S.startAzure(e) : console.error("service not found - must be either 'webspeech' or 'azure'");
  }
  static startWebSpeech(t) {
    S.stop(), this._service = new I(), this._service.start(t);
  }
  static isWebSpeechSupported() {
    return !!I.getAPI();
  }
  static startAzure(t) {
    S.stop(), this._service = new R(), this._service.start(t);
  }
  static stop() {
    var t;
    (t = this._service) != null && t.recognizing && this._service.stop();
  }
  static endCommandMode() {
    this._service && u.toggleCommandModeOff(this._service);
  }
}
window.SpeechToElement = S;
export {
  S as default
};
