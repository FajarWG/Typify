import React from 'react'

const Keyboards = () => {
  return (
    <>
    <div className="keyboard-toolbar">
      <i id="keyboard-toggle" className="tool ion-eye">
        <span className="hint">Toggle keyboard</span>
      </i>
      <i id="hands-toggle" className="tool ion-android-hand">
        <span className="hint">Toggle hands</span>
      </i>
      <i id="color-toggle" className="tool ion-paintbucket">
        <span className="hint">Toggle colors</span>
      </i>
    </div>
    <div className="keyboard-container">
    <div className="keyline">
      <div className="key group-1" id="backquote">
        `
        <div className="subkey">~</div>
      </div>
      <div className="key group-1" id="1">
        1
        <div className="subkey">!</div>
      </div>
      <div className="key group-2" id="2">
        2
        <div className="subkey">@</div>
      </div>
      <div className="key group-3" id="3">
        3
        <div className="subkey">#</div>
      </div>
      <div className="key group-4" id="4">
        4
        <div className="subkey">$</div>
      </div>
      <div className="key group-4" id="5">
        5
        <div className="subkey">%</div>
      </div>
      <div className="key group-5" id="6">
        6
        <div className="subkey">^</div>
      </div>
      <div className="key group-5" id="7">
        7
        <div className="subkey">&</div>
      </div>
      <div className="key group-6" id="8">
        8
        <div className="subkey">*</div>
      </div>
      <div className="key group-7" id="9">
        9
        <div className="subkey">(</div>
      </div>
      <div className="key group-8" id="0">
        0
        <div className="subkey">)</div>
      </div>
      <div className="key group-8" id="minus">
        _
        <div className="subkey">-</div>
      </div>
      <div className="key group-8" id="equal">
        =
        <div className="subkey">+</div>
      </div>
      <div className="key non-group" id="backspace">backspace</div>
    </div>
    <div className="keyline">
      <div className="key non-group" id="tab">tab</div>
      <div className="key group-1" id="q">q</div>
      <div className="key group-2" id="w">w</div>
      <div className="key group-3" id="e">e</div>
      <div className="key group-4" id="r">r</div>
      <div className="key group-4" id="t">t</div>
      <div className="key group-5" id="y">y</div>
      <div className="key group-5" id="u">u</div>
      <div className="key group-6" id="i">i</div>
      <div className="key group-7" id="o">o</div>
      <div className="key group-8" id="p">p</div>
      <div className="key group-8" id="bracketl">[
        <div className="subkey">{"{"}</div>
      </div>
      <div className="key group-8" id="bracketr">]
        <div className="subkey">{"}"}</div>
      </div>
      <div className="key group-8" id="backslash">\
        <div className="subkey">|</div>
      </div>
    </div>
     <div className="keyline">
      <div className="key non-group" id="caps_lock">Caps Lock</div>
      <div className="key group-1" id="a">a</div>
      <div className="key group-2" id="s">s</div>
      <div className="key group-3" id="d">d</div>
      <div className="key group-4" id="f">f</div>
      <div className="key group-4" id="g">g</div>
      <div className="key group-5" id="h">h</div>
      <div className="key group-5" id="j">j</div>
      <div className="key group-6" id="k">k</div>
      <div className="key group-7" id="l">l</div>
      <div className="key group-8" id="semicolon">;
        <div className="subkey">:</div>
      </div>
      <div className="key group-8" id="quote">&quot;
        <div className="subkey">,</div>
      </div>
      <div className="key non-group" id="enter">Enter</div>
      </div>
      <div className="keyline">
      <div className="key group-1" id="shift-l">Shift</div>
      <div className="key group-1" id="z">z</div>
      <div className="key group-2" id="x">x</div>
      <div className="key group-3" id="c">c</div>
      <div className="key group-4" id="v">v</div>
      <div className="key group-4" id="b">b</div>
      <div className="key group-5" id="n">n</div>
      <div className="key group-5" id="m">m</div>
      <div className="key group-6" id="comma">{"<"}<div className="subkey">,</div></div>
      <div className="key group-7" id="period">{">"}
          <div className="subkey">.</div>
        </div>
      <div className="key group-8" id="slash">/
          <div className="subkey">?</div>
        </div>
      <div className="key group-8" id="shift-r">Shift</div>
    </div>
    <div className="keyline">
        <div className="key" id="space"></div>
      </div>
    </div>
    </>
  )
}

export default Keyboards