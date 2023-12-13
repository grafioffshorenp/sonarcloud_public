<template>

  <div class="max-w-6xl m-auto mb-10">
    <div class="c-button-back">
      <a href="javascript:history.back()">
        <div class="c-button-back__icon">
          <i class="fas fa-arrow-left"></i>
        </div>
      </a>

      <a href="javascript:history.back()">{{ $t('Ga terug') }}</a>
    </div>

    <h1 class="text-4xl mt-10">{{ $t("Employee detail") }}</h1>

    <div class="page__wrapper rtl active is-overview-page  bg-white mt-10 p-10 px-32">
      <section class="page__content page__content--no-padding-top">
        <div class="c-card c-card--hide-styling">
          <section class="page-details__section page-details__section--centered page-details__section--stroke relative">
            <ProfilePicture :employee="employee" type="large"/>
            <h2 v-if="employee.display_name">{{ employee.display_name }}</h2>
            <h2 v-else>{{ employee.first_name }} {{ employee.last_name }}</h2>
          </section>
        </div>
      </section>


      <section :class="['page-details__section', { 'page-details__section--hide-bottom': hideBottom }]">
        <h1 class="text-zinc-800 text-2xl mb-4">{{ $t("Personal data") }}</h1>
        <div>
          <div class="grid grid-cols-2 gap-4">

            <div v-if="employee.region" class="page-details__properties">
              <p class="header">{{ $t("Locatie") }}</p>
              <p class="body">{{ employee.region }}</p>
            </div>

            <div v-if="employee.birthdate" class="page-details__properties">
              <p class="header">{{ $t("Leeftijd") }}</p>
              <p class="body bold">{{ moment().diff(employee.birthdate, 'years') }}</p>
            </div>

            <div
                v-if="isEmployer && hideTopDetails && employee.attendance_percentage !== undefined"
                class="page-details__properties"
            >
              <p class="header">{{ $t("Opkomstpercentage") }}</p>
              <p class="body">
                {{
                  attendancePercentage
                      ? `${employee.attendance_percentage}%`
                      : $t("Niet bekend")
                }}
              </p>
            </div>

            <div v-if="employee.mobile" class="page-details__properties">
              <p class="header">{{ "Mobiel telefoonnummer" }}</p>
              <p class="body bold">{{ employee.mobile }}</p>
            </div>

            <div v-if="employee.email" class="page-details__properties">
              <p class="header">{{ "E-mailadres" }}</p>
              <p class="body bold">{{ employee.email }}</p>
            </div>
          </div>
          <div v-if="employee.driver_licenses && employee.driver_licenses.length" class="page-details__properties">
            <p class="header">{{ $t("Rijbewijs") }}</p>
            <p class="body">
              <span v-for="(license, index) in employee.driver_licenses" :key="index">
                {{ license }}<template v-if="index < employee.driver_licenses - 1">, </template>
              </span>
            </p>
          </div>

          <hr class="border-b my-4" />
          <h1 class="text-zinc-800 text-2xl mb-4">{{ $t("Vaardigheden") }}</h1>
          <EmployeeSkillsFunction :employee="employee" />

          <hr class="border-b my-4" />
          <h1 class="text-zinc-800 text-2xl mb-4">{{ $t("Talen") }}</h1>
          <EmployeeLanguages :employee="employee" />

          <hr class="border-b my-4" />
          <h1 class="text-zinc-800 text-2xl mb-4">{{ $t("Opleidingen") }}</h1>
          <EmployeeEducation :educations="employee.educations" />

          <hr class="border-b my-4" />
          <h1 class="text-zinc-800 text-2xl mb-4">{{ $t("Recente werkervaring") }}</h1>
          <EmployeeWorkExperience :work-experience="employee.work_experiences" />
        </div>

        <hr class="border-b my-4" />
        <h1 class="text-zinc-800 text-2xl mb-4">{{ $t("Motivatie") }}</h1>
        <div v-if="employee.about" class="page-details__properties">
          <p>{{ employee.about }}</p>
        </div>
      </section>

    </div>
  </div>
</template>
<script setup>
import moment from "moment";

const route = useRoute();
const userStore = useUserStore();
const user = await userStore.fetchUser();

let employeeId = route.params.id[0];
const {data} = await useRWApi(`/employer/employee/${employeeId}/profile`, { method: 'GET' })
let employee = data;
</script>