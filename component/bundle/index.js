const x = class {
  static capitalize(a) {
    return a.replace(x.FIRST_CHAR_REGEX, (t) => t.toUpperCase());
  }
  static lineBreak(a) {
    return a.replace(x.DOUBLE_LINE, "<p></p>").replace(x.ONE_LINE, "<br>");
  }
  static isCharDefined(a) {
    return a !== void 0 && a !== " " && a !== " " && a !== `
` && a !== "";
  }
  static breakupIntoWordsArr(a) {
    return a.split(/(\W+)/);
  }
};
let l = x;
l.FIRST_CHAR_REGEX = /\S/;
l.DOUBLE_LINE = /\n\n/g;
l.ONE_LINE = /\n/g;
class F {
  static translate(t, e) {
    const i = l.breakupIntoWordsArr(t);
    for (let r = 0; r < i.length; r += 1)
      e[i[r]] && (i[r] = e[i[r]]);
    return i.join("");
  }
}
class D {
  static extract(t, e, i) {
    let r = "";
    for (let n = t.resultIndex; n < t.results.length; ++n) {
      let s = t.results[n][0].transcript;
      i && (s = F.translate(s, i)), t.results[n].isFinal ? e += s : r += s;
    }
    return { interimTranscript: r, finalTranscript: e, newText: r || e };
  }
  static extractSafari(t, e, i) {
    let r = "";
    const n = "";
    for (let s = t.resultIndex; s < t.results.length; ++s) {
      let o = t.results[s][0].transcript;
      i && (o = F.translate(o, i)), r += o;
    }
    return { interimTranscript: n, finalTranscript: r, newText: n || r };
  }
}
const R = class {
};
let w = R;
w.IS_SAFARI = () => (R._IS_SAFARI === void 0 && (R._IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)), R._IS_SAFARI);
const h = class {
  static getElementIfFocusedOnAvailable(a, t) {
    return Array.isArray(a) ? a.find((e) => t === e) : t === a ? a : void 0;
  }
  static keyDownWindow(a) {
    a.element && h.getElementIfFocusedOnAvailable(a.element, document.activeElement) && (h.KEY_DOWN_TIMEOUT !== null && clearTimeout(h.KEY_DOWN_TIMEOUT), h.KEY_DOWN_TIMEOUT = setTimeout(() => {
      h.KEY_DOWN_TIMEOUT = null, this.resetRecording(a);
    }, 500));
  }
  static mouseDownWindow(a, t) {
    this.mouseDownElement = h.getElementIfFocusedOnAvailable(a, t.target);
  }
  static mouseUpWindow(a) {
    this.mouseDownElement && this.resetRecording(a), this.mouseDownElement = void 0;
  }
  static add(a, t) {
    const e = (t == null ? void 0 : t.insertInCursorLocation) === void 0 || (t == null ? void 0 : t.insertInCursorLocation);
    t != null && t.element && e && (a.mouseDownEvent = h.mouseDownWindow.bind(a, t.element), document.addEventListener("mousedown", a.mouseDownEvent), a.mouseUpEvent = h.mouseUpWindow.bind(a, t), document.addEventListener("mouseup", a.mouseUpEvent), a.keyDownEvent = h.keyDownWindow.bind(a, t), document.addEventListener("keydown", a.keyDownEvent));
  }
  static remove(a) {
    document.removeEventListener("mousedown", a.mouseDownEvent), document.removeEventListener("mouseup", a.mouseUpEvent), document.removeEventListener("keydown", a.keyDownEvent);
  }
};
let N = h;
N.KEY_DOWN_TIMEOUT = null;
class B {
  static process(t, e, i, r, n) {
    const s = r == null ? void 0 : r(e, i);
    return s ? (setTimeout(() => {
      s.restart ? t.resetRecording(n) : s.stop && t.stop();
    }), (s.stop || s.restart) && s.removeNewText) : !1;
  }
}
class S {
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
    return t && S.isElementOverflown(e);
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
  static isInsideShadowDOM(t) {
    return t.getRootNode() instanceof ShadowRoot;
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
      d.setOffsetForGeneric(t, r + e);
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
    u.toggleCommandModeOff(t), f.isPrimitiveElement(r) ? (r.value = i, t.isTargetInShadow || d.setOffsetForPrimitive(r, i.length, !0), w.IS_SAFARI() && t.autoScroll && S.scrollSafariPrimitiveToEnd(r)) : (r.textContent = i, t.isTargetInShadow || d.focusEndOfGeneric(r), setTimeout(() => S.scrollGeneric(t, r))), t.resetRecording(e);
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
    var C, P, k;
    const s = t.commands;
    if (!s || !r || !i)
      return;
    const o = ((C = s.settings) == null ? void 0 : C.caseSensitive) === !0 ? e : e.toLowerCase(), c = l.breakupIntoWordsArr(o), m = ((P = s.settings) == null ? void 0 : P.substrings) === !1 ? u.checkIfMatchesWord : u.checkIfMatchesSubstring;
    if (s.commandMode && m(s.commandMode, o, c))
      return t.setInterimColorToFinal(), setTimeout(() => u.toggleCommandModeOn(t)), { doNotProcessTranscription: !1 };
    if (!(s.commandMode && !t.isWaitingForCommand)) {
      if (s.stop && m(s.stop, o, c))
        return u.toggleCommandModeOff(t), setTimeout(() => t.stop()), { doNotProcessTranscription: !1 };
      if (s.pause && m(s.pause, o, c))
        return u.toggleCommandModeOff(t), t.setInterimColorToFinal(), setTimeout(() => {
          var M;
          t.isPaused = !0, (M = t.onPauseTrigger) == null || M.call(t, !0);
        }), { doNotProcessTranscription: !1 };
      if (s.resume && m(s.resume, o, c))
        return t.isPaused = !1, (k = t.onPauseTrigger) == null || k.call(t, !1), u.toggleCommandModeOff(t), t.resetRecording(i), { doNotProcessTranscription: !0 };
      if (s.reset && m(s.reset, o, c))
        return n !== void 0 && u.setText(t, i, n, r), { doNotProcessTranscription: !0 };
      if (s.removeAllText && m(s.removeAllText, o, c))
        return u.setText(t, i, "", r), { doNotProcessTranscription: !0 };
    }
  }
}
class T {
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
    document.activeElement === e && (f.isPrimitiveElement(e) ? T.setStateForPrimitive(t, e) : T.setStateForGeneric(t, e));
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
        const c = d.getGenericElementCursorOffset(e, o, !0), m = (r = e.textContent) == null ? void 0 : r[c - 1], C = d.getGenericElementCursorOffset(e, o, !1), P = (n = e.textContent) == null ? void 0 : n[C];
        l.isCharDefined(m) && (t.startPadding = " "), l.isCharDefined(P) && (t.endPadding = " "), t.isCursorAtEnd = ((s = e.textContent) == null ? void 0 : s.length) === C;
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
class W {
  // this is mostly used for Azure to prevent user from stopping when it is connecting
  constructor() {
    this.finalTranscript = "", this.interimSpan = f.createInterimSpan(), this.finalSpan = f.createGenericSpan(), this.scrollingSpan = f.createGenericSpan(), this.isCursorAtEnd = !1, this.spansPopulated = !1, this.startPadding = "", this.endPadding = "", this.numberOfSpacesBeforeNewText = 0, this.numberOfSpacesAfterNewText = 0, this.isHighlighted = !1, this.primitiveTextRecorded = !1, this.recognizing = !1, this._displayInterimResults = !0, this.insertInCursorLocation = !0, this.autoScroll = !0, this.isRestarting = !1, this.isPaused = !1, this.isWaitingForCommand = !1, this.isTargetInShadow = !1, this.cannotBeStopped = !1, this.resetState();
  }
  prepareBeforeStart(t) {
    var e, i;
    if (t != null && t.element)
      if (N.add(this, t), Array.isArray(t.element)) {
        const n = t.element.find((s) => s === document.activeElement) || t.element[0];
        if (!n)
          return;
        this.prepare(n);
      } else
        this.prepare(t.element);
    (t == null ? void 0 : t.displayInterimResults) !== void 0 && (this._displayInterimResults = t.displayInterimResults), t != null && t.textColor && (this._finalTextColor = (e = t == null ? void 0 : t.textColor) == null ? void 0 : e.final, f.applyCustomColors(this, t.textColor)), (t == null ? void 0 : t.insertInCursorLocation) !== void 0 && (this.insertInCursorLocation = t.insertInCursorLocation), (t == null ? void 0 : t.autoScroll) !== void 0 && (this.autoScroll = t.autoScroll), this._onResult = t == null ? void 0 : t.onResult, this._onPreResult = t == null ? void 0 : t.onPreResult, this._onStart = t == null ? void 0 : t.onStart, this._onStop = t == null ? void 0 : t.onStop, this._onError = t == null ? void 0 : t.onError, this.onCommandModeTrigger = t == null ? void 0 : t.onCommandModeTrigger, this.onPauseTrigger = t == null ? void 0 : t.onPauseTrigger, this._options = t, (i = this._options) != null && i.commands && (this.commands = u.process(this._options.commands));
  }
  prepare(t) {
    E.setState(this, t), T.setState(this, t), this.isTargetInShadow = f.isInsideShadowDOM(t), f.isPrimitiveElement(t) ? (this._primitiveElement = t, this._originalText = this._primitiveElement.value) : (this._genericElement = t, this._originalText = this._genericElement.textContent);
  }
  // there was an attempt to optimize this by not having to restart the service and just reset state:
  // unfortunately it did not work because the service would still continue firing the intermediate and final results
  // into the new position
  resetRecording(t) {
    this.isRestarting = !0, this.stop(!0), this.resetState(!0), this.start(t, !0);
  }
  // prettier-ignore
  updateElements(t, e, i) {
    var o;
    const r = l.capitalize(e);
    if (this.finalTranscript === r && t === "")
      return;
    B.process(this, i, t === "", this._onPreResult, this._options) && (t = "", i = "");
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
    (o = this._onResult) == null || o.call(this, i, t === ""), this.finalTranscript = r, this._displayInterimResults || (t = "");
    const s = this.finalTranscript === "" && t === "";
    this._primitiveElement ? this.updatePrimitiveElement(this._primitiveElement, t, s) : this._genericElement && this.updateGenericElement(this._genericElement, t, s);
  }
  // prettier-ignore
  // remember that padding values here contain actual text left and right
  updatePrimitiveElement(t, e, i) {
    this.isHighlighted && T.removeForPrimitive(this, t), this.primitiveTextRecorded || E.adjustStateAfterRecodingPrimitiveElement(this, t), i && E.adjustSateForNoTextPrimitiveElement(this);
    const r = this.startPadding + this.finalTranscript + e;
    if (t.value = r + this.endPadding, !this.isTargetInShadow) {
      const n = r.length + this.numberOfSpacesAfterNewText;
      d.setOffsetForPrimitive(t, n, this.autoScroll);
    }
    this.autoScroll && w.IS_SAFARI() && this.isCursorAtEnd && S.scrollSafariPrimitiveToEnd(t);
  }
  updateGenericElement(t, e, i) {
    this.isHighlighted && T.removeForGeneric(this, t), this.spansPopulated || f.appendSpans(this, t);
    const r = (i ? "" : this.startPadding) + l.lineBreak(this.finalTranscript);
    this.finalSpan.innerHTML = r;
    const n = S.isRequired(this.autoScroll, t);
    S.changeStateIfNeeded(this, n);
    const s = l.lineBreak(e) + (i ? "" : this.endPadding);
    this.interimSpan.innerHTML = s, w.IS_SAFARI() && this.insertInCursorLocation && d.setOffsetForSafariGeneric(t, r.length + s.length), n && S.scrollGeneric(this, t), i && (this.scrollingSpan.innerHTML = "");
  }
  finalise(t) {
    this._genericElement && (t ? (this.finalSpan = f.createGenericSpan(), this.setInterimColorToFinal(), this.interimSpan = f.createInterimSpan(), this.scrollingSpan = f.createGenericSpan()) : this._genericElement.textContent = this._genericElement.textContent, this.spansPopulated = !1), N.remove(this);
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
class I extends W {
  constructor() {
    super();
  }
  start(t) {
    var e;
    this._extractText === void 0 && (this._extractText = w.IS_SAFARI() ? D.extractSafari : D.extract), this.validate() && (this.prepareBeforeStart(t), this.instantiateService(t), (e = this._service) == null || e.start(), this._translations = t == null ? void 0 : t.translations);
  }
  validate() {
    return I.getAPI() ? !0 : (this.error("Speech Recognition is unsupported"), !1);
  }
  instantiateService(t) {
    var i;
    const e = I.getAPI();
    this._service = new e(), this._service.continuous = !0, this._service.interimResults = (t == null ? void 0 : t.displayInterimResults) ?? !0, this._service.lang = ((i = t == null ? void 0 : t.language) == null ? void 0 : i.trim()) || "en-US", this.setEvents();
  }
  setEvents() {
    this._service && (this._service.onstart = () => {
      this.setStateOnStart();
    }, this._service.onerror = (t) => {
      w.IS_SAFARI() && t.message === "Another request is started" || t.error === "aborted" && this.isRestarting || t.error !== "no-speech" && this.error(t.message || t.error);
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
    console.error(t), this.setStateOnError(t), this.stop();
  }
}
const A = class {
  static doubleClickDetector() {
    return A.doubleClickPending ? !0 : (A.doubleClickPending = !0, setTimeout(() => {
      A.doubleClickPending = !1;
    }, 300), !1);
  }
};
let g = A;
g.doubleClickPending = !1;
class L {
  static applyPrevention(t) {
    clearTimeout(t._manualConnectionStopPrevention), t.cannotBeStopped = !0, t._manualConnectionStopPrevention = setTimeout(() => {
      t.cannotBeStopped = !1;
    }, 800);
  }
  static clearPrevention(t) {
    clearTimeout(t._manualConnectionStopPrevention), t.cannotBeStopped = !1;
  }
}
const p = "https://github.com/OvidijusParsiunas/speech-to-element";
class _ {
  static validateOptions(t, e) {
    return e ? !e.subscriptionKey && !e.token && !e.retrieveToken ? (t(`Please define a 'subscriptionKey', 'token' or 'retrieveToken' property - more info: ${p}`), !1) : e.region ? !0 : (t(`Please define a 'region' property - more info: ${p}`), !1) : (t(`Please provide subscription details - more info: ${p}`), !1);
  }
  static async getNewSpeechConfig(t, e) {
    if (e.region)
      return e.subscriptionKey ? t.fromSubscription(e.subscriptionKey.trim(), e.region.trim()) : e.token ? t.fromAuthorizationToken(e.token.trim(), e.region.trim()) : e.retrieveToken ? e.retrieveToken().then((i) => e.region ? t.fromAuthorizationToken((i == null ? void 0 : i.trim()) || "", e.region.trim()) : null).catch((i) => (console.error(i), null)) : null;
  }
  static process(t, e) {
    e.language && (t.speechRecognitionLanguage = e.language.trim());
  }
  static async get(t, e) {
    const i = await _.getNewSpeechConfig(t, e);
    return i && _.process(i, e), i;
  }
}
const y = class {
  // 20s
  static set(a) {
    a.stopTimeout = setTimeout(() => a.stop(), a.stopTimeoutMS);
  }
  static reset(a, t) {
    a.stopTimeoutMS = t || y.DEFAULT_MS, a.stopTimeout && clearTimeout(a.stopTimeout), y.set(a);
  }
};
let O = y;
O.DEFAULT_MS = 2e4;
class G {
  // newText is used to only send new text in onResult as finalTranscript is continuously accumulated
  static extract(t, e, i, r) {
    return r && (t = F.translate(t, r)), i ? { interimTranscript: "", finalTranscript: e + t, newText: t } : { interimTranscript: t, finalTranscript: e, newText: t };
  }
}
class b extends W {
  constructor() {
    super(...arguments), this._newTextPadding = "";
  }
  // Unlike webspeech there is no automatic space between final results
  start(t, e) {
    this._newTextPadding = "", this.stopTimeout === void 0 && O.reset(this, t == null ? void 0 : t.stopAfterSilenceMs), this.prepareBeforeStart(t), this.startAsync(t), e || L.applyPrevention(this);
  }
  async startAsync(t) {
    var e;
    this.validate(t) && (await this.instantiateService(t), this._translations = t == null ? void 0 : t.translations, (e = this._service) == null || e.startContinuousRecognitionAsync(() => {
    }, this.error));
  }
  validate(t) {
    return b.getAPI() ? _.validateOptions(this.error.bind(this), t) : (this.moduleNotFound(), !1);
  }
  async instantiateService(t) {
    const e = b.getAPI(), i = e.AudioConfig.fromDefaultMicrophoneInput(), r = await _.get(e.SpeechConfig, t);
    if (r) {
      const n = new e.SpeechRecognizer(r, i);
      this.setEvents(n), this._service = n, t.retrieveToken && this.retrieveTokenInterval(t.retrieveToken);
    } else
      this.error("Unable to contact Azure server");
  }
  setEvents(t) {
    t.recognizing = this.onRecognizing.bind(this), t.recognized = this.onRecognized.bind(this), t.sessionStarted = this.onSessionStarted.bind(this), t.canceled = this.onCanceled.bind(this), t.sessionStopped = this.onSessionStopped.bind(this);
  }
  // prettier-ignore
  onRecognizing(t, e) {
    if (this._stopping)
      return;
    const { interimTranscript: i, finalTranscript: r, newText: n } = G.extract(
      this._newTextPadding + e.result.text,
      this.finalTranscript,
      !1,
      this._translations
    );
    O.reset(this, this.stopTimeoutMS), this.updateElements(i, r, n);
  }
  // prettier-ignore
  onRecognized(t, e) {
    const i = e.result;
    switch (i.reason) {
      case window.SpeechSDK.ResultReason.Canceled:
        break;
      case window.SpeechSDK.ResultReason.RecognizedSpeech:
        if (i.text && !this._stopping) {
          const { interimTranscript: r, finalTranscript: n, newText: s } = G.extract(
            this._newTextPadding + i.text,
            this.finalTranscript,
            !0,
            this._translations
          );
          O.reset(this, this.stopTimeoutMS), this.updateElements(r, n, s), n !== "" && (this._newTextPadding = " ");
        }
        break;
    }
  }
  onCanceled(t, e) {
    e.reason === window.SpeechSDK.CancellationReason.Error && this.error(e.errorDetails);
  }
  onSessionStarted() {
    L.clearPrevention(this), this.setStateOnStart();
  }
  onSessionStopped() {
    this._retrieveTokenInterval || clearInterval(this._retrieveTokenInterval), this._stopping = !1, this.setStateOnStop();
  }
  retrieveTokenInterval(t) {
    this._retrieveTokenInterval = setInterval(() => {
      t == null || t().then((e) => {
        this._service && (this._service.authorizationToken = (e == null ? void 0 : e.trim()) || "");
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
    this._retrieveTokenInterval && clearInterval(this._retrieveTokenInterval), console.error(t), this.setStateOnError(t), this.stop();
  }
}
class v {
  static toggle(t, e) {
    var r, n;
    const i = t.toLocaleLowerCase().trim();
    (r = g.service) != null && r.recognizing ? this.stop() : i === "webspeech" ? v.startWebSpeech(e) : i === "azure" ? v.startAzure(e) : (console.error("service not found - must be either 'webspeech' or 'azure'"), (n = e == null ? void 0 : e.onError) == null || n.call(e, "service not found - must be either 'webspeech' or 'azure'"));
  }
  static startWebSpeech(t) {
    v.stop() || (g.service = new I(), g.service.start(t));
  }
  static isWebSpeechSupported() {
    return !!I.getAPI();
  }
  static startAzure(t) {
    var e;
    v.stop() || (e = g.service) != null && e.cannotBeStopped || (g.service = new b(), g.service.start(t));
  }
  static stop() {
    var t;
    return g.doubleClickDetector() ? !0 : ((t = g.service) != null && t.recognizing && g.service.stop(), !1);
  }
  static endCommandMode() {
    g.service && u.toggleCommandModeOff(g.service);
  }
}
window.SpeechToElement = v;
export {
  v as default
};
