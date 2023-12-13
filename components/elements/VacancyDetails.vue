<template>
    <section v-if="vacancy">
        <article class="page-details">
            <header class="page-vacancy__header page-vacancy__header--desktop">
                <h1 class="t-title-2 t-title-2--teal translate">{{ vacancy.function_template.name }}</h1>
            </header>

            <section class="page-details__section">
                <template v-if="vacancy.function_template.intro">
                    <div class="u-mb-medium">
                        <h2 class="t-title-2 t-title-2--section-title">{{ $t("Intro") }}</h2>
                    </div>
                    <div class="page-vacancy__minimum-education-level page-vacancy__minimum-education-level--mobile">
                        <small class="t-text t-text--bold t-text--grey">
                            {{ $t("Minimaal niveau:") }} {{ vacancy.function_template.minimum_education_level }}
                        </small>
                    </div>
                    <div class="u-pre-line">
                        <p class="t-text t-text--grey translate">
                            {{ vacancy.function_template.intro }}
                        </p>
                    </div>
                </template>
            </section>

            <section class="page-details__section">
                <div class="u-mb-small">
                    <h2 class="t-title-2 t-title-2--section-title">{{ $t("Taal") }}</h2>
                </div>
                <div class="u-mb-small">
                    <ul v-if="vacancy.function_template.languages" class="l-inline-items l-inline-items--wrap">
                        <li v-for=" language  in  vacancy.function_template.languages " :key="`language-${language}`"
                            class="u-mb-small">
                            <div class="c-pill c-pill--selected">
                                {{ $t(language) }}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="pre-line" v-if="vacancy.function_template.minimum_language_level">
                    <small class="t-text t-text--small t-text--grey">
                        {{ $t("Minimaal niveau:") }} {{ vacancy.function_template.minimum_language_level }}
                    </small>
                </div>
            </section>

            <section class="page-details__section">
                <div class="u-mb-small">
                    <h2 class="t-title-2 t-title-2--section-title">{{ $t("Opleidingsniveau") }}</h2>
                </div>
                <div class="pre-line" v-if="vacancy.function_template.minimum_education_level">
                    <small class="t-text t-text--small t-text--grey">
                        {{ $t("Minimaal niveau:") }} {{ vacancy.function_template.minimum_education_level || $t('geen') }}
                    </small>
                </div>
            </section>

            <section class="page-details__section">
                <div class="u-mb-small">
                    <h2 class="t-title-2 t-title-2--section-title">{{ $t("Wat ga je doen?") }}</h2>
                </div>
                <p v-if="vacancy.description && !vacancy.function_template.skills.find((el) => { el.type === 'hard' })"
                    class="pre-line">
                    {{ vacancy.description }}
                </p>
                <div class="u-mb-small">
                    <ul class="l-inline-items l-inline-items--wrap">
                        <template v-for=" skill in vacancy.function_template.skills" :key="`skill-${skill.id}`">
                            <li class="u-mb-small" v-if="skill.id && skill.type === 'hard'">
                                <div class="c-pill c-pill--selected">
                                    {{ $t(skill.name) }}
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </section>

            <section class="page-details__section">
                <div class="u-mb-small">
                    <h2 class="t-title-2 t-title-2--section-title">{{ $t("Wie zoeken wij?") }}</h2>
                </div>
                <p v-if="vacancy.description && !vacancy.function_template.skills.find((el) => { el.type === 'soft' })"
                    class="pre-line">
                    {{ vacancy.description }}
                </p>
                <div class="u-mb-small">
                    <ul class="l-inline-items l-inline-items--wrap">
                        <template v-for=" skill in vacancy.function_template.skills" :key="`skill-${skill.id}`">
                            <li class="u-mb-small" v-if="skill.id && skill.type === 'soft'">
                                <div class="c-pill c-pill--selected">
                                    {{ $t(skill.name) }}
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </section>

            <div v-if="vacancy.industry && vacancy.industry.vog_text" class="u-mb-big">
                <p class="t-text t-text--grey" v-html="vacancy.industry.vog_text" />
            </div>

            <div class="u-mb-medium-big">
                <h2 class="t-heading-2 t-heading-2--section-title">{{ $t("Over") }} {{ vacancy.employer.name }}
                </h2>
            </div>
            <div class="pre-line" v-if="vacancy.employer.company_profile">
                <p class="t-text--grey translate about-text">
                    {{ vacancy.employer.company_profile }}
                </p>
            </div>
        </article>
    </section>
</template>

<script setup>
const props = defineProps({
    vacancy: {
        type: Object,
        default: null,
        required: true,
    }
})
</script>