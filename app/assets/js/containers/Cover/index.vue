<template>
  <transition
      appear
      :name="transitionName"
      :duration="transitionDuration"
      @afterEnter="onAfterEnter"
      @beforeLeave="onBeforeLeave"
  >
    <section @wheel.passive="wheelListener" v-swipe.down="swipeDownHandler" v-show="active"
             :class="[$style.root, { [$style.isAppLoaded]: isAppLoaded }]" :id="id">
      <span ref="top" :class="$style.intersectTop" data-pos="top"/>
      <div :class="$style.pic" ref="pic">
        <transition name="async-avatar" appear :duration="transitionDuration">
          <Avatar v-if="active" :active="active" :class="$style.avatar" :foreground="oli" :background="oli"/>
        </transition>
      </div>
      <div :class="$style.body">

        <h2 lang="ja" :class="$style.headline">こんにちは！</h2>
        <article :class="$style.text">
          <p>My name is <b>Oliver Sim.</b></p>
          <p>I am a <b>Full Stack Developer</b> / <b>UX Engineer</b> from Malaysia. Passionate about clean architecture
            and best web development practice. Living in Selangor. I speak English, Malay, Mandarin, and some Hokkien.
          </p>
          <p>Minimalist. Loves dogs. Enjoys football.</p>
        </article>
        <footer :class="$style.footer">
          <SocialList :items="socials" :class="$style.socialList"/>
        </footer>
      </div>
      <a :href="`#${NAV_PATH_JOBS}`" @click.prevent="gotoPagelist" :class="$style.scrollhint">
        <div>Get to know me</div>
        <Ico :class="$style.scrollhintIco" name="chevron-down"/>
      </a>
      <span ref="bottom" :class="$style.intersectBottom" data-pos="bottom"/>
    </section>
  </transition>
</template>

<script>
import {mapActions, mapState} from 'vuex';
//import anime from 'animejs';
import {GROUP_COVER, GROUP_LOADER, GROUP_PAGELIST, NAV_PATH_HOME, NAV_PATH_JOBS} from '@/shared/constants';
import marco from 'images/marco.jpg';
import oli from 'images/oliver.jpg';
import animal from 'images/marco-full.jpg';
import Ico from '@/objects/Ico';
import SocialList from '@/objects/SocialList';
import observerMixin from '@/shared/observer.mixin';
import {TYPES as UI_ACTIONS} from '@/store/ui.actions';
import {toInteger} from '@/shared/utils';

const Avatar = () => import(/* webpackChunkName: "pixi" */ '@/objects/Avatar/pixi');


export default {


  components: {
    Avatar,
    Ico,
    SocialList
  },

  mixins: [observerMixin],

  data() {
    return {
      id: NAV_PATH_HOME,
      NAV_PATH_JOBS,
      oli,
      marco,
      animal,
      firstEnter: true,
      canScroll: false
    };
  },

  computed: {

    ...mapState({
      socials: (state) => state.data.socials,
      activeGroup: (state) => state.ui.activeGroup,
      activeNav: (state) => state.ui.activeNav,
      isAppLoaded: (state) => state.ui.isLoaded
    }),

    transitionDuration() {

      const {appearEnterTiming, slideEnterTiming, slideLeaveTiming} = this.$style;

      if (this.transitionName === 'appear') {
        return {
          enter: toInteger(appearEnterTiming),
          // BEWARE: dirty hach
          // avatar v-if cannot catch the updated transitionName
          // and removes the avatar asap
          leave: toInteger(slideLeaveTiming)
        };
      }

      return {
        enter: toInteger(slideEnterTiming),
        leave: toInteger(slideLeaveTiming)
      };


    },

    active() {
      if (this.$mq.matches('tablet-landscape')) {
        return this.activeGroup === GROUP_COVER;
      }
      return this.activeGroup === GROUP_COVER || this.activeGroup === GROUP_PAGELIST;
    },

    transitionName() {
      return this.firstEnter ? 'appear' : 'slide';
    }
  },

  watch: {
    activeGroup(val, oldVal) {
      this.firstEnter = (this.active && oldVal === GROUP_LOADER);
    }
  },

  created() {

    this.$on('enter', ({id}) => {
      this.$store.dispatch(`ui/${UI_ACTIONS.ROUTE_UPDATED}`, id);
    });
  },

  methods: {

    ...mapActions('ui', {
      navigateToAction: UI_ACTIONS.NAVIGATED_TO,
      scrollCompleted: UI_ACTIONS.PAGELISTSCROLL_COMPLETED
    }),

    gotoPagelist() {
      this.navigateToAction({route: NAV_PATH_JOBS, force: true});
      this.$nextTick(() => {
        this.scrollCompleted();
      });
    },

    swipeDownHandler() {
      if (this.activeNav || this.$mq.matchesUntil('tablet-landscape')) {
        return;
      }

      this.gotoPagelist();

    },

    wheelListener(e) {

      if (this.canScroll === false || this.activeNav || this.$mq.matchesUntil('tablet-landscape')) {
        return;
      }

      if (e.deltaY > 0) {
        this.gotoPagelist();
      }
    },

    /*onEnter(el, done) {

        //const { pic, body, scrollhint } = this.$refs;


        if (this.firstEnter === true) {

            /*const timeline = anime.timeline({
                autoplay: false,
                easing: 'easeOutSine'
            });

            timeline.add({
                targets: [pic, body],
                opacity: [0, 1],
                translateX: (elm) => [(elm === pic ? '15%' : '7%'), 0],
                duration: 400,
                delay: 350,
                complete: done
            }).add({
                targets: scrollhint,
                opacity: 0.8,
                translateX: ['-50%', '-50%'],
                translateY: ['-10%', 0],
                duration: 500,
                delay: 3250 // 4000 - 350 - 400
            }).play();* /

            / *setTimeout(() => {
                done();
            }, this.timings.appearIn);* /

        } else {

            if (this.timeline) {
                this.timeline.pause();
                this.timeline.seek(0);
            }

            anime({
                targets: el,
                opacity: {
                    value: [0, 1],
                    duration: 0
                },
                translateY: ['-100%', 0],
                duration: 800,
                delay: 50,
                easing: 'easeInOutCirc',
                complete: done
            });

        }
    },*/

    onAfterEnter() {
      this.canScroll = true;
    },

    onBeforeLeave() {
      this.canScroll = false;
    }//,

    /*onLeave(el, done) {

        const {
            pic, scrollhint, title, table, footer
        } = this.$refs;

        const timeline = anime.timeline({
            complete: done,
            autoplay: false,
            easing: 'easeInOutCubic'
        });

        this.timeline = timeline;


        if (this.firstEnter === false) {

            timeline.add([{
                targets: [pic, scrollhint],
                opacity: [1, 0],
                duration: 300
            }, {
                targets: title,
                translateY: '-300%',
                opacity: 0,
                duration: 500,
                offset: '+=350'
            }, {
                targets: table,
                translateY: '-200%',
                opacity: 0,
                duration: 500,
                offset: '-=300'
            }, {
                targets: footer,
                translateY: '-200%',
                opacity: 0,
                duration: 500,
                offset: '-=300'
            }, {
                targets: el,
                translateY: '-100%',
                duration: 700
            }, {
                targets: el,
                opacity: 0,
                duration: 200
            }]).play();
        }
    }*/
  }
};
</script>

<style lang="scss" module src="./cover.scss"/>