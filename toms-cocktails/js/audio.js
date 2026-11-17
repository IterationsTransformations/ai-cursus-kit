/* Tom's Cocktails — geluid met WebAudio (alles live gegenereerd, geen bestanden) */
(function () {
  'use strict';
  var ctx = null, master = null, sfxOn = true, musicOn = false, music = null, noiseBuf = null;

  function ensure() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
      master = ctx.createGain(); master.gain.value = 0.7; master.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* stil */ } }
    return ctx;
  }

  function env(g, t, a, peak, dec) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
  }
  function tone(freq, t, dur, type, vol, dest) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    env(g, t, 0.005, vol || 0.2, dur);
    o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + dur + 0.05);
    return o;
  }
  function noise(t, dur, filterType, freq, q, vol, dest) {
    var src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
    var f = ctx.createBiquadFilter(); f.type = filterType; f.frequency.value = freq; f.Q.value = q || 1;
    var g = ctx.createGain(); env(g, t, 0.01, vol || 0.2, dur);
    src.connect(f); f.connect(g); g.connect(dest || master);
    src.start(t, Math.random()); src.stop(t + dur + 0.1);
    return { src: src, f: f, g: g };
  }

  var S = {
    click: function () {
      if (!sfxOn || !ensure()) return;
      var t = ctx.currentTime; tone(1800, t, 0.04, 'triangle', 0.06);
    },
    pop: function () {
      if (!sfxOn || !ensure()) return;
      var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(980, t + 0.08);
      env(g, t, 0.004, 0.16, 0.1); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.2);
    },
    clink: function (n) {
      if (!sfxOn || !ensure()) return;
      var t = ctx.currentTime; n = n || 3;
      for (var i = 0; i < n; i++) {
        var tt = t + i * (0.07 + Math.random() * 0.06), f = 2400 + Math.random() * 1800;
        tone(f, tt, 0.18, 'sine', 0.08); tone(f * 2.76, tt, 0.08, 'sine', 0.03);
      }
    },
    pour: function (dur) {
      if (!sfxOn || !ensure()) return;
      dur = dur || 1.4;
      var t = ctx.currentTime, n = noise(t, dur, 'bandpass', 700, 0.9, 0.18);
      n.f.frequency.setValueAtTime(500, t); n.f.frequency.linearRampToValueAtTime(1500, t + dur);
      // bloebgeluidjes
      for (var i = 0; i < 8; i++) {
        var tt = t + Math.random() * dur, o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.setValueAtTime(300 + Math.random() * 400, tt); o.frequency.exponentialRampToValueAtTime(900 + Math.random() * 500, tt + 0.05);
        env(g, tt, 0.003, 0.03, 0.05); o.connect(g); g.connect(master); o.start(tt); o.stop(tt + 0.1);
      }
    },
    shake: function (dur) {
      if (!sfxOn || !ensure()) return function () {};
      var t = ctx.currentTime, stopAt = t + dur, nodes = [];
      for (var x = t, k = 0; x < stopAt; x += 0.19, k++) {
        nodes.push(noise(x, 0.09, 'highpass', 2500 + (k % 2) * 800, 0.7, 0.16).src);
        if (k % 2 === 0) { nodes.push(tone(3000 + Math.random() * 1500, x + 0.02, 0.05, 'sine', 0.04)); }
      }
      return function () { nodes.forEach(function (n) { try { n.stop(); } catch (e) { /* al gestopt */ } }); };
    },
    stir: function (dur) {
      if (!sfxOn || !ensure()) return function () {};
      var t = ctx.currentTime, nodes = [];
      for (var x = t; x < t + dur; x += 0.42) {
        nodes.push(tone(3200 + Math.random() * 900, x, 0.14, 'sine', 0.035));
        nodes.push(noise(x, 0.3, 'bandpass', 1800, 2, 0.03).src);
      }
      return function () { nodes.forEach(function (n) { try { n.stop(); } catch (e) { /* al gestopt */ } }); };
    },
    blend: function (dur) {
      if (!sfxOn || !ensure()) return function () {};
      var t = ctx.currentTime, n = noise(t, dur, 'lowpass', 900, 4, 0.14);
      var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = 95;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.04, t + 0.3); g.gain.setValueAtTime(0.04, t + dur - 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
      return function () { try { n.src.stop(); o.stop(); } catch (e) { /* al gestopt */ } };
    },
    muddle: function () {
      if (!sfxOn || !ensure()) return;
      var t = ctx.currentTime;
      for (var i = 0; i < 4; i++) { tone(110, t + i * 0.28, 0.12, 'sine', 0.18); noise(t + i * 0.28, 0.08, 'lowpass', 600, 1, 0.12); }
    },
    tick: function (hi) {
      if (!sfxOn || !ensure()) return;
      tone(hi ? 1320 : 880, ctx.currentTime, 0.07, 'square', 0.04);
    },
    chime: function () {
      if (!sfxOn || !ensure()) return;
      var t = ctx.currentTime;
      [659.25, 830.61, 987.77, 1318.5].forEach(function (f, i) { tone(f, t + i * 0.09, 0.9, 'sine', 0.09); tone(f * 2, t + i * 0.09, 0.3, 'sine', 0.02); });
    },
    cheers: function () {
      if (!sfxOn || !ensure()) return;
      var t = ctx.currentTime;
      [3100, 3900, 3500].forEach(function (f, i) { tone(f, t + i * 0.012, 1.2, 'sine', 0.07); tone(f * 1.5, t + i * 0.012, 0.6, 'sine', 0.02); });
      setTimeout(S.chime, 350);
    },
    whoosh: function () {
      if (!sfxOn || !ensure()) return;
      var t = ctx.currentTime, n = noise(t, 0.35, 'bandpass', 400, 1.2, 0.08);
      n.f.frequency.setValueAtTime(300, t); n.f.frequency.exponentialRampToValueAtTime(2400, t + 0.35);
    }
  };

  /* ---------- Achtergrondmuziek: rustige lounge-loop ---------- */
  function startMusic() {
    if (!ensure() || music) return;
    var bus = ctx.createGain(); bus.gain.value = 0.0001; bus.connect(master);
    bus.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 2);
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200; lp.connect(bus);
    var bpm = 84, beat = 60 / bpm, bar = beat * 4;
    // ii-V-I-vi in F: Gm9, C13, Fmaj9, Dm9
    var chords = [[196, 233.08, 293.66, 349.23, 440], [130.81, 233.08, 329.63, 440, 293.66], [174.61, 220, 261.63, 329.63, 392], [146.83, 174.61, 220, 261.63, 329.63]];
    var bass = [98, 65.41, 87.31, 73.42];
    var next = ctx.currentTime + 0.1, idx = 0;
    function epiano(f, t, dur) {
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), trem = ctx.createOscillator(), tg = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f; o2.type = 'triangle'; o2.frequency.value = f * 2.001;
      trem.frequency.value = 4.2; tg.gain.value = 0.012; trem.connect(tg); tg.connect(g.gain);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.045, t + 0.02); g.gain.exponentialRampToValueAtTime(0.012, t + dur * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      var g2 = ctx.createGain(); g2.gain.value = 0.25; o2.connect(g2); g2.connect(g);
      o.connect(g); g.connect(lp);
      [o, o2, trem].forEach(function (x) { x.start(t); x.stop(t + dur + 0.1); });
    }
    function schedule() {
      while (next < ctx.currentTime + 1.5) {
        var ch = chords[idx % 4], t = next;
        ch.forEach(function (f, i) { epiano(f, t + i * 0.015, bar * 0.95); });
        epiano(ch[2] * 2, t + beat * 2.5, beat * 1.2);
        // bas
        [0, 2.5].forEach(function (b, j) {
          var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = j ? bass[idx % 4] * 1.5 : bass[idx % 4];
          g.gain.setValueAtTime(0.0001, t + b * beat); g.gain.exponentialRampToValueAtTime(0.12, t + b * beat + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + b * beat + beat * 1.3);
          o.connect(g); g.connect(bus); o.start(t + b * beat); o.stop(t + b * beat + beat * 1.5);
        });
        // borstels op de snare
        for (var k = 0; k < 8; k++) {
          var tt = t + k * beat / 2 + (k % 2 ? beat * 0.08 : 0);
          var src = ctx.createBufferSource(); src.buffer = noiseBuf;
          var f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6000;
          var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, tt); g.gain.exponentialRampToValueAtTime(k % 4 === 2 ? 0.05 : 0.022, tt + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.12);
          src.connect(f); f.connect(g); g.connect(bus); src.start(tt, Math.random()); src.stop(tt + 0.15);
        }
        next += bar; idx++;
      }
    }
    schedule();
    var timer = setInterval(schedule, 400);
    music = { bus: bus, timer: timer };
  }
  function stopMusic() {
    if (!music) return;
    var m = music; music = null;
    clearInterval(m.timer);
    try { m.bus.gain.cancelScheduledValues(ctx.currentTime); m.bus.gain.setValueAtTime(m.bus.gain.value, ctx.currentTime); m.bus.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8); } catch (e) { /* stil */ }
    setTimeout(function () { try { m.bus.disconnect(); } catch (e) { /* stil */ } }, 1000);
  }

  window.TCAudio = {
    sfx: S,
    setSfx: function (on) { sfxOn = !!on; },
    sfxOn: function () { return sfxOn; },
    setMusic: function (on) { musicOn = !!on; if (on) startMusic(); else stopMusic(); },
    musicOn: function () { return musicOn; },
    wantMusic: function () { musicOn = true; },
    unlock: function () { if (musicOn && !music) startMusic(); else ensure(); }
  };
})();
