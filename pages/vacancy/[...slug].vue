<template>
    <div class="vacancy-detail-page">
        <div class="l-container" v-if="vacancy">
            <div class="page-vacancy__btn-back">
              <div class="c-button-back">
                <a href="javascript:history.back()">
                  <div class="c-button-back__icon">
                    <i class="fas fa-arrow-left"></i>
                  </div>
                </a>

                <a href="javascript:history.back()">{{ $t('Ga terug') }}</a>
              </div>
            </div>
            <article class="page page-vacancy">
                <header class="page-vacancy__header page-vacancy__header--mobile">
                    <h1 class="t-title-2 t-title-2--teal translate">{{ vacancy.function_template.name }}</h1>
                </header>
                <div class="page-vacancy__inner">
                    <!-- Details right -->
                    <ElementsVacancySidebar :vacancy="vacancy" :user="user" />
                    <div class="page-vacancy__details">
                        <!-- Details middle -->
                        <ElementsVacancyDetails :vacancy="vacancy" />
                        <!-- Footer -->
                        <footer class="page-vacancy__footer margin-bot">
                            <div class="page-vacancy__footer-top">
                                <div class="c-company">
                                    <div v-if="vacancy.function_template.logo" class="c-company__image">
                                        <img :src="vacancy.function_template.logo" :alt="vacancy.employer.name" />
                                    </div>
                                    <div v-else class="c-company__fallback-icon">
                                        <i class="fas fa-building" />
                                    </div>
                                    <div class="c-company__details">
                                        <p class="t-text t-text--bolder">{{ vacancy.employer.name }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="page-vacancy__footer-button">
                                <ElementsApplyToJobPostButton :vacancy="vacancy" :user="user" />
                            </div>
                        </footer>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const { locale, availableLocales } = useI18n();

const userStore = useUserStore();
const { status } = useAuth();
const authenticated = status.value === 'authenticated';
const user = authenticated ? await userStore.fetchUser() : null;

const vacancy = ref();

let jobPostId = route.params.slug[2];
try {
    const vacancyData = await useRWApi(`/job_posts/${jobPostId}`, { method: 'GET' });
    if (vacancyData && vacancyData.data) {
        vacancy.value = vacancyData.data;
    }
} catch (e) {
    console.log('Error:', e);

    throw createError({
        statusCode: 404,
        message: 'not found',
        fatal: true
    })
}
</script>

<style lang="scss" scoped>
.margin-bot {
    margin-bottom: 90px;
}

.vacancy-detail-page {
    background: white;
}
</style>