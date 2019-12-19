import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;
declare var arbor: any;

@Component({
  selector: 'app-arborjs',
  templateUrl: './arborjs.component.html',
  styleUrls: ['./arborjs.component.css']
})
export class ArborjsComponent implements OnInit {
  generateForm: FormGroup;
  submitted = false;

  constructor(public fb: FormBuilder) {
  }

  ngOnInit() {
    this.generateForm = this.fb.group({
      nodes: ['', Validators.required]
    });
  }

  get f() { return this.generateForm.controls; }

  loadGraph() {
    this.submitted = true;

    if (this.generateForm.invalid) {
      return true;
    }

    const CLR = {
      branch: '#b2b19d',
      code: 'orange',
      doc: '#922E00',
      demo: '#a7af00'
    };

    const theUI = {
      nodes: {
        'arbor.js': { color: 'red', shape: 'dot', alpha: 1, radius: 1, label: 'welcome' },

        demos: { color: CLR.branch, shape: 'dot', alpha: 1 },
        halfviz: { color: CLR.demo, alpha: 0, link: '/halfviz' },
        atlas: { color: CLR.demo, alpha: 0, link: '/atlas' },
        echolalia: { color: CLR.demo, alpha: 0, link: '/echolalia' },

        docs: { color: CLR.branch, shape: 'dot', alpha: 1 },
        reference: { color: CLR.doc, alpha: 0, link: '#reference' },
        introduction: { color: CLR.doc, alpha: 0, link: '#introduction' },

        code: { color: CLR.branch, shape: 'dot', alpha: 1 },
        github: { color: CLR.code, alpha: 0, link: 'https://github.com/samizdatco/arbor' },
        '.zip': { color: CLR.code, alpha: 0, link: '/js/dist/arbor-v0.92.zip' },
        '.tar.gz': { color: CLR.code, alpha: 0, link: '/js/dist/arbor-v0.92.tar.gz' }
      },
      edges: {
        'arbor.js': {
          demos: { length: .8, data: { name: 'A->B' } },
          docs: { length: .8 },
          code: { length: .8 }
        },
        demos: {
          halfviz: {},
          atlas: {},
          echolalia: {}
        },
        docs: {
          reference: {},
          introduction: {}
        },
        code: {
          '.zip': {},
          '.tar.gz': {},
          'github': {}
        }
      }
    };

    const sys = arbor.ParticleSystem();
    sys.parameters({ stiffness: 900, repulsion: 2000, gravity: true, dt: 0.015 });
    sys.renderer = Renderer('#sitemap');
    sys.graft(theUI);

    const nav = Nav('#nav');
    $(sys.renderer).bind('navigate', nav.navigate);
    $(nav).bind('mode', sys.renderer.switchMode);
    nav.init();
  }

}

const Renderer = function (elt) {
  const dom = $(elt);
  const canvas = dom.get(0);
  const ctx = canvas.getContext('2d');
  const gfx = arbor.Graphics(canvas);
  let sys = null;

  let _vignette = null;
  let selected = null,
    nearest = null,
    _mouseP = null;


  const that = {
    init: function (pSystem) {
      sys = pSystem;
      sys.screen({
        size: { width: dom.width(), height: dom.height() },
        padding: [36, 60, 36, 60]
      });

      $(window).resize(that.resize);
      that.resize();
      that._initMouseHandling();

      if (document.referrer.match(/echolalia|atlas|halfviz/)) {
        // if we got here by hitting the back button in one of the demos,
        // start with the demos section pre-selected
        that.switchSection('demos');
      }
    },
    resize: function () {
      canvas.width = $(window).width();
      canvas.height = .75 * $(window).height();
      sys.screen({ size: { width: canvas.width, height: canvas.height } });
      _vignette = null;
      that.redraw();
    },
    redraw: function () {
      gfx.clear();
      sys.eachEdge(function (edge, p1, p2) {
        if (edge.source.data.alpha * edge.target.data.alpha === 0) { return; }
        gfx.line(p1, p2, { stroke: '#b2b19d', width: 2, alpha: edge.target.data.alpha });
        // gfx.text(edge.data.data.name, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2, { color: 'black', align: 'center', font: 'Arial', size: 12 });
        // ctx.fillText (edge.data.data.name, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      });
      sys.eachNode(function (node, pt) {
        const w = Math.max(20, 20 + gfx.textWidth(node.name));
        if (node.data.alpha === 0) { return; }
        if (node.data.shape === 'dot') {
          gfx.oval(pt.x - w / 2, pt.y - w / 2, w, w, { fill: node.data.color, alpha: node.data.alpha });
          gfx.text(node.name, pt.x, pt.y + 7, { color: 'white', align: 'center', font: 'Arial', size: 12 });
          gfx.text(node.name, pt.x, pt.y + 7, { color: 'white', align: 'center', font: 'Arial', size: 12 });
        } else {
          gfx.rect(pt.x - w / 2, pt.y - 8, w, 20, 4, { fill: node.data.color, alpha: node.data.alpha });
          gfx.text(node.name, pt.x, pt.y + 9, { color: 'white', align: 'center', font: 'Arial', size: 12 });
          gfx.text(node.name, pt.x, pt.y + 9, { color: 'white', align: 'center', font: 'Arial', size: 12 });
        }
      });
      that._drawVignette();
    },

    _drawVignette: function () {
      const w = canvas.width;
      const h = canvas.height;
      const r = 20;

      if (!_vignette) {
        const top = ctx.createLinearGradient(0, 0, 0, r);
        top.addColorStop(0, '#e0e0e0');
        top.addColorStop(.7, 'rgba(255,255,255,0)');

        const bot = ctx.createLinearGradient(0, h - r, 0, h);
        bot.addColorStop(0, 'rgba(255,255,255,0)');
        bot.addColorStop(1, 'white');

        _vignette = { top: top, bot: bot };
      }

      // top
      ctx.fillStyle = _vignette.top;
      ctx.fillRect(0, 0, w, r);

      // bot
      ctx.fillStyle = _vignette.bot;
      ctx.fillRect(0, h - r, w, r);
    },

    switchMode: function (e) {
      if (e.mode === 'hidden') {
        dom.stop(true).fadeTo(e.dt, 0, function () {
          if (sys) { sys.stop(); }
          $(this).hide();
        });
      } else if (e.mode === 'visible') {
        dom.stop(true).css('opacity', 0).show().fadeTo(e.dt, 1, function () {
          that.resize();
        });
        if (sys) { sys.start(); }
      }
    },

    switchSection: function (newSection) {
      const parent = sys.getEdgesFrom(newSection)[0].source;
      const children = $.map(sys.getEdgesFrom(newSection), function (edge) {
        return edge.target;
      });

      sys.eachNode(function (node) {
        if (node.data.shape === 'dot') { return; } // skip all but leafnodes

        const nowVisible = ($.inArray(node, children) >= 0);
        const newAlpha = (nowVisible) ? 1 : 0;
        const dt = (nowVisible) ? .5 : .5;
        sys.tweenNode(node, dt, { alpha: newAlpha });

        if (newAlpha === 1) {
          node.p.x = parent.p.x + .05 * Math.random() - .025;
          node.p.y = parent.p.y + .05 * Math.random() - .025;
          node.tempMass = .001;
        }
      });
    },


    _initMouseHandling: function () {
      // no-nonsense drag and drop (thanks springy.js)
      selected = null;
      nearest = null;
      let dragged = null;
      const oldmass = 1;

      let _section = null;

      const handler = {
        moved: function (e) {
          const pos = $(canvas).offset();
          _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
          nearest = sys.nearest(_mouseP);

          if (!nearest.node) { return false; }

          if (nearest.node.data.shape !== 'dot') {
            selected = (nearest.distance < 50) ? nearest : null;
            if (selected) {
              dom.addClass('linkable');
              window.status = selected.node.data.link.replace(/^\//, 'http://' + window.location.host + '/').replace(/^#/, '');
            } else {
              dom.removeClass('linkable');
              window.status = '';
            }
          } else if ($.inArray(nearest.node.name, ['arbor.js', 'code', 'docs', 'demos']) >= 0) {
            if (nearest.node.name !== _section) {
              _section = nearest.node.name;
              that.switchSection(_section);
            }
            dom.removeClass('linkable');
            window.status = '';
          }

          return false;
        },
        clicked: function (e) {
          const pos = $(canvas).offset();
          _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);
          nearest = dragged = sys.nearest(_mouseP);

          if (nearest && selected && nearest.node === selected.node) {
            const link = selected.node.data.link;
            if (link.match(/^#/)) {
              $(that).trigger({ type: 'navigate', path: link.substr(1) });
            } else {
              window.location = link;
            }
            return false;
          }


          if (dragged && dragged.node !== null) { dragged.node.fixed = true; }

          $(canvas).unbind('mousemove', handler.moved);
          $(canvas).bind('mousemove', handler.dragged);
          $(window).bind('mouseup', handler.dropped);

          return false;
        },
        dragged: function (e) {
          const old_nearest = nearest && nearest.node._id;
          const pos = $(canvas).offset();
          const s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top);

          if (!nearest) { return; }
          if (dragged !== null && dragged.node !== null) {
            const p = sys.fromScreen(s);
            dragged.node.p = p;
          }

          return false;
        },

        dropped: function (e) {
          if (dragged === null || dragged.node === undefined) { return; }
          if (dragged.node !== null) { dragged.node.fixed = false; }
          dragged.node.tempMass = 1000;
          dragged = null;
          // selected = null
          $(canvas).unbind('mousemove', handler.dragged);
          $(window).unbind('mouseup', handler.dropped);
          $(canvas).bind('mousemove', handler.moved);
          _mouseP = null;
          return false;
        }
      };

      $(canvas).mousedown(handler.clicked);
      $(canvas).mousemove(handler.moved);

    }
  };

  return that;
};

const Nav = function (elt) {
  const dom = $(elt);

  let _path = null;

  const that = {
    init: function () {
      $(window).bind('popstate', that.navigate);
      dom.find('> a').click(that.back);
      $('.more').one('click', that.more);

      $('#docs dl:not(.datastructure) dt').click(that.reveal);
      that.update();
      return that;
    },
    more: function (e) {
      $(this).removeAttr('href').addClass('less').html('&nbsp;').siblings().fadeIn();
      $(this).next('h2').find('a').one('click', that.less);

      return false;
    },
    less: function (e) {
      const more = $(this).closest('h2').prev('a');
      $(this).closest('h2').prev('a')
        .nextAll().fadeOut(function () {
          $(more).text('creation & use').removeClass('less').attr('href', '#');
        });
      $(this).closest('h2').prev('a').one('click', that.more);

      return false;
    },
    reveal: function (e) {
      $(this).next('dd').fadeToggle('fast');
      return false;
    },
    back: function () {
      _path = '/';
      if (window.history && window.history.pushState) {
        window.history.pushState({ path: _path }, '', _path);
      }
      that.update();
      return false;
    },
    navigate: function (e) {
      const oldpath = _path;
      if (e.type === 'navigate') {
        _path = e.path;
        if (window.history && window.history.pushState) {
          window.history.pushState({ path: _path }, '', _path);
        } else {
          that.update();
        }
      } else if (e.type === 'popstate') {
        const state = e.originalEvent.state || {};
        _path = state.path || window.location.pathname.replace(/^\//, '');
      }
      if (_path !== oldpath) { that.update(); }
    },
    update: function () {
      let dt = 'fast';
      if (_path === null) {
        // this is the original page load. don't animate anything just jump
        // to the proper state
        _path = window.location.pathname.replace(/^\//, '');
        dt = '0';
        dom.find('p').css('opacity', 0).show().fadeTo('slow', 1);
      }

      switch (_path) {
        case '':
        case '/':
          dom.find('p').text('a graph visualization library using web workers and jQuery');
          dom.find('> a').removeClass('active').attr('href', '#');

          $('#docs').fadeTo('fast', 0, function () {
            $(this).hide();
            $(that).trigger({ type: 'mode', mode: 'visible', dt: dt });
          });
          document.title = 'arbor.js';
          break;

        case 'introduction':
        case 'reference':
          $(that).trigger({ type: 'mode', mode: 'hidden', dt: dt });
          dom.find('> p').text(_path);
          dom.find('> a').addClass('active').attr('href', '#');
          $('#docs').stop(true).css({ opacity: 0 }).show().delay(333).fadeTo('fast', 1);

          $('#docs').find('>div').hide();
          $('#docs').find('#' + _path).show();
          document.title = 'arbor.js » ' + _path;
          break;
      }

    }
  };
  return that;
};
