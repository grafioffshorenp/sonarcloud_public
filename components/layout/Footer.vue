<template>
    <footer v-if="footer" class="c-main-footer">
        <div class="l-container">
            <div class="c-main-footer__inner">
                <div v-if="footer.poweredBy" class="c-main-footer__column">
                    <div class="t-main-footer__powered-by-title" v-if="footer.poweredBy.title">
                        <h3 class="t-title-small t-title-small--white">{{ $t(footer.poweredBy.title) }}</h3>
                    </div>

                    <div v-if="footer.poweredBy.logos.length" class="c-main-footer__logos">
                        <img v-for="logo in footer.poweredBy.logos" :key="logo.url" :src="logo.url" :alt="logo.title"
                            class="c-main-footer__logo" />
                    </div>
                </div>

                <div v-if="footer.quickLinks" class="c-main-footer__column">
                    <ul v-if="footer.quickLinks.length" class="">
                        <li v-for="navigationItem in footer.quickLinks" :key="navigationItem.link.text"
                            class="c-main-footer__quick-links-item">
                            <a v-if="navigationItem"
                                :href="navigationItem.link.text === 'Privacy & Cookies' ? usePath().getSlug(navigationItem.link.url) : navigationItem.link.url"
                                :target="navigationItem.link.target ? '_blank' : '_self'"
                                :rel="navigationItem.link.target ? 'noopener noreferrer' : ''" class="t-link t-link--white">
                                {{ $t(navigationItem.link.text) }}
                            </a>
                        </li>
                        <li style="color: white;" class="c-main-footer__quick-links-item">
                            {{ $t("Contact") }}:
                            <a class="t-link t-link--white" href="mailto:info@refugeework.nl">info@refugeework.nl</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
const footer = {
    poweredBy: {
        title: "Een initiatief vanuit",
        logos: [
            { url: 'https://np-rw-site-production.s3-eu-west-1.amazonaws.com/vwn.svg', title: 'vwn' },
            { url: 'https://np-rw-site-production.s3-eu-west-1.amazonaws.com/Start-Foundation-wit_2022-07-15-075837_thpl.svg', title: 'Start Foundation wit' }
        ]
    },
    quickLinks: [
        {
            link: { text: 'Uitgevoerd door Youbahn', url: 'https://www.youbahn.nl/', target: '_blank' }
        },
        {
            link: { text: 'Privacy & Cookies', url: 'https://www.refugeework.nl/privacy-en-cookies', target: '_blank' }
        }
    ]

}
</script>

<style lang="scss" scoped>
.l-container {
    @include container;
}

.c-main-footer {
    margin-top: 5rem;
    padding: 3.5rem 1.5rem;

    background-color: $blue;

    @include mobile-only {
        padding: 1.5rem;
    }

    &--until-desktop {
        display: block;

        @include until-desktop {
            display: none;
        }
    }

    @include desktop {
        margin-top: 6.25rem;
        padding: 2rem 0 1.5rem;
    }
}

.c-main-footer__inner {
    @include desktop {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
}

.t-main-footer__powered-by-title {
    margin-bottom: 1rem;

    text-align: center;
    font-size: 14px;
    line-height: 19px;
    font-weight: 600;
    color: $white;

    h3 {
        font-family: $secondary-font;
    }

    @include desktop {
        text-align: left;
    }
}

.c-main-footer__logos {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    @include desktop {
        justify-content: flex-start;
    }
}

.c-main-footer__logo {
    height: 45px;
    margin: 0 0.5rem 1rem;

    @include desktop {
        margin: 0 1rem;

        &:first-of-type {
            margin-left: 0;
        }
    }
}

.c-main-footer__quick-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    margin: 2.5rem auto 0;
    max-width: 340px;

    list-style-type: none;

    @include mobile-only {
        margin: 1.5rem auto 0;
    }

    @include desktop {
        max-width: initial;
    }
}

.c-main-footer__quick-links-item {
    margin: 0 0.5rem 0.5rem;
}

.t-link {
    font-size: 16px;
    line-height: 24px;
    font-family: $font-body;
    text-decoration: none;

    transition: color 0.2s;

    @include on-event {
        color: $blue;
    }

    &--white {
        color: $white;

        @include on-event {
            color: $white;
            text-decoration: underline;
        }
    }
}
</style>