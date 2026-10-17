import VueTypes from 'vue-types';

export default {
    props: {
        observe: VueTypes.bool.def(true)
    },

    created() {
        this.observers = [];
    },

    mounted() {

        if (this.observe) {
            this.observers.push(
                this.createTopObserver(this.$refs.top),
                this.createBottomObserver(this.$refs.bottom)
            );
        }


    },

    destroyed() {
        if (this.observers.length > 0) {
            this.observers.forEach((observer) => observer.disconnect());
            this.observers.length = 0;
        }
    },

    methods: {

        // entry.rootBounds can be null (e.g. inside cross-origin iframes or before layout),
        // so fall back to the viewport to avoid "Cannot read properties of null (reading 'top')"
        getRootBounds(entry) {
            return entry.rootBounds || {
                top: 0,
                bottom: window.innerHeight,
                height: window.innerHeight
            };
        },

        createTopObserver(el) {

            const config = {
                threshold: [0]
            };

            const observer = new IntersectionObserver(([entry]) => {
                const targetInfo = entry.boundingClientRect;
                const rootBoundsInfo = this.getRootBounds(entry);

                if (targetInfo.bottom < rootBoundsInfo.top) {
                    //console.log(this.id, 'top', 'leaving');
                } else if (targetInfo.top < rootBoundsInfo.bottom && targetInfo.top > (rootBoundsInfo.height * 0.75)) {
                    this.$emit('enter', { id: this.id, dir: 'top' });
                }
            }, config);

            observer.observe(el);

            return observer;
        },

        createBottomObserver(el) {
            const config = {
                threshold: [1]
            };

            const observer = new IntersectionObserver(([entry]) => {
                const targetInfo = entry.boundingClientRect;
                const rootBoundsInfo = this.getRootBounds(entry);
                const ratio = entry.intersectionRatio;
                if (targetInfo.bottom > rootBoundsInfo.top && ratio >= 1 && targetInfo.top < (rootBoundsInfo.height / 4)) {
                    this.$emit('enter', { id: this.id, dir: 'bottom' });
                }
                /* else if (targetInfo.top < rootBoundsInfo.top &&
                    targetInfo.bottom < rootBoundsInfo.bottom) {
                    console.log(this.id, 'bottom', 'leaving');
                }*/
            }, config);

            observer.observe(el);

            return observer;
        }
    }
};