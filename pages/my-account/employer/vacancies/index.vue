<template>

  <main>
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">

      <div v-if="!employerHasVacancies">
        <div class="text-center bg-white shadow-lg mt-10 p-10 rounded border py-20">
          <h2 class="font-bold text-xl">{{ $t('Is je profiel compleet? Maak dan je eerste functie aan.') }}</h2>
          <p>{{ $t('Begin met het aanmaken van een functie. Hier kan je vervolgens vacatures aan toevoegen.') }}</p>
          <br/>
          <nuxt-link to="/my-account/employer/vacancies/new" class="btn c-btn m-auto">
            {{ $t('Voeg functie toe') }} +
          </nuxt-link>
        </div>
      </div>

      <div class="flex justify-between space-x-10" v-if="employerHasVacancies">

        <ul class="flex flex-wrap justify-between w-4/5 bg-[#2395d3] rounded-lg pl-5 pr-5">
          <li class="items-center align-middle flex">
            <a @click="setStatus('all')" :class="status === 'all' ? 'font-bold border-b-white border-b-2' : ''"
               class="px-2 border-red-400 text-white hover:text-white">{{ $t('Alles') }}</a>
          </li>
          <li class="items-center align-middle flex">
            <a @click="setStatus('open')" :class="status === 'open' ? 'font-bold border-b-white border-b-2' : ''"
               class="px-2 border-red-400 text-white hover:text-white">{{ $t('Open') }}</a>
          </li>
          <li class="items-center align-middle flex">
            <a @click="setStatus('filled')"
               :class="status === 'filled' ? 'font-bold border-b-white border-b-2' : ''"
               class="px-2 border-red-400 text-white hover:text-white">{{ $t('Vervuld') }}</a>
          </li>
          <li class="items-center align-middle flex">
            <a @click="setStatus('started')"
               :class="status === 'started' ? 'font-bold border-b-white border-b-2' : ''"
               class="px-2 border-red-400 text-white hover:text-white">{{ $t('Gestart') }}</a>
          </li>
          <li class="items-center align-middle flex">
            <a @click="setStatus('offline')"
               :class="status === 'offline' ? 'font-bold border-b-white border-b-2' : ''"
               class="px-2 border-red-400 text-white hover:text-white">{{ $t('Offline') }}</a>
          </li>
          <li class="items-center align-middle flex">
            <a @click="setStatus('archived')"
               :class="status === 'archived' ? 'font-bold border-b-white border-b-2' : ''"
               class="px-2 border-red-400 text-white hover:text-white">{{ $t('Gearchiveerd') }}</a>
          </li>
        </ul>

        <div class="w-1/5">
          <NuxtLink :to="localePath('/my-account/employer/vacancies/new')"
                    class="inline-block w-full text-center px-5 py-5 bg-orange-500 rounded-lg text-white">{{
              $t('Plaats vacature')
            }} +
          </NuxtLink>
        </div>

      </div>

      <div class="table mt-10" v-if="employerHasVacancies">
        <div class="table__row table__row--transparent-bg desktop-only" v-if="vacancies.length">
          <div class="table__column">
            <div class="table__cell" @click="sortBy('function')">
              <p class="table__title">
                {{ $t('Functie') }}
                <i class="fad table__sort-icon" :class="sortDirection === 'asc' ? 'fa-sort-down' : 'fa-sort-up'"
                   v-if="sortColumn === 'function'"></i>
              </p>
            </div>
          </div>
          <div class="table__column table__cell--middle">
            <div class="table__cell" @click="sortBy('date')">
              <p class="table__title table__title--active">
                {{ $t('Datum') }}
                <i class="fad table__sort-icon" :class="sortDirection === 'asc' ? 'fa-sort-down' : 'fa-sort-up'"
                   v-if="sortColumn === 'date'"></i>
              </p>
            </div>
            <div class="table__cell" @click="sortBy('time')">
              <p class="table__title">
                {{ $t('Tijd') }}
                <i class="fad table__sort-icon" :class="sortDirection === 'asc' ? 'fa-sort-down' : 'fa-sort-up'"
                   v-if="sortColumn === 'time'"></i>
              </p>
            </div>
          </div>
          <div class="table__column table__cell--right">
            <div class="table__cell table__cell--quarter" @click="sortBy('employees')">
              <p class="table__title table__title--centered">
                {{ $t('Werknemers') }}
                <i class="fad table__sort-icon" :class="sortDirection === 'asc' ? 'fa-sort-down' : 'fa-sort-up'"
                   v-if="sortColumn === 'employees'"></i>
              </p>
            </div>
            <div class="table__cell table__cell--quarter" @click="sortBy('reactions')">
              <p class="table__title table__title--centered">
                {{ $t('Reacties') }}
                <i class="fad table__sort-icon" :class="sortDirection === 'asc' ? 'fa-sort-down' : 'fa-sort-up'"
                   v-if="sortColumn === 'reactions'"></i>
              </p>
            </div>
            <div class="table__cell table__cell--quarter" @click="sortBy('status')">
              <p class="table__title table__title--centered">
                {{ $t('Status') }}
                <i class="fad table__sort-icon" :class="sortDirection === 'asc' ? 'fa-sort-down' : 'fa-sort-up'"
                   v-if="sortColumn === 'status'"></i>
              </p>
            </div>
            <div class="table__cell table__cell--quarter" @click="sortBy('status')">
              <p class="table__title table__title--centered">
                <!-- {{ $t("Edit") }} -->
                <!-- <i class="fad table__sort-icon" :class="sortDirection === 'asc' ? 'fa-sort-down' : 'fa-sort-up'" v-if="sortColumn === 'status'"></i> -->
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5">
          {{ $t('Geen resultaten') }}
        </div>

        <div class="table__row table__row--clickable" @click="goToShift(jobpost)" v-for="jobpost in vacancies"
             :key="jobpost.id">
          <div class="table__column table__column--mobile-row">
            <div class="table__cell table__cell--full-width">
              <p class="table__text table__text--large-mobile table__text--primary-mobile table__text--color">
                <strong>{{ jobpost.function.name }}</strong>
              </p>
              <p v-if="jobpost.function.name !== jobpost.function_template.name"
                 class="table__text table__text--small">
                {{ jobpost.function_template.name }}
              </p>
              <p class="table__text table__text--small">{{ jobpost.street }} {{
                  jobpost.house_number
                }}{{ jobpost.house_number_ext }}, {{ jobpost.city }}</p>
            </div>
            <div v-if="windowWidth < desktopBreakpoint"
                 class="table__cell table__cell--narrow table__cell--no-padding">
              <i v-click-outside="hideOptions" class="fas fa-ellipsis-v table__ellipsis" @click="toggleOptions"></i>
            </div>
          </div>
          <div class="table__column table__column table__cell--middle">
            <div class="table__cell table__cell--mobile-stretch">
              <p v-if="isGig(jobpost)" class="table__text"><i
                  class="fal fa-calendar table__info-icon"></i>{{ date(jobpost) }}</p>
              <p v-else class="table__text table__text--no-break table__text--small">
                <i class="fal fa-calendar table__info-icon"></i>{{ date(jobpost)[0] }} {{ $t('t/m') }}
                <br class="desktop-only"/>
                {{ date(jobpost)[1] }}
              </p>
            </div>
            <div class="table__cell table__cell--mobile-stretch">
              <p v-if="isGig(jobpost)" class="table__text table__text--small">
                <i class="fal fa-clock table__info-icon"></i>{{ startTime(jobpost) }} {{ $t('tot') }}
                <br class="desktop-only"/>{{ endTime(jobpost) }}
                {{ $t('uur') }}
              </p>
              <p v-else class="table__text until-desktop-only"><i class="fal fa-clock table__info-icon"></i>-</p>
            </div>
          </div>
          <div
              class="table__column table__column--mobile-row table__column--no-margin table__column--light-bg flex-wrap table__cell--right">
            <div class="table__cell table__cell--centered-content table__cell--no-padding until-desktop-only">
              <p class="table__text">{{ 'Werknemers' }}</p>
            </div>
            <div class="table__cell table__cell--centered-content table__cell--no-padding until-desktop-only">
              <p class="table__text">{{ 'Reacties' }}</p>
            </div>
            <div class="table__cell table__cell--centered-content table__cell--no-padding until-desktop-only">
              <p class="table__text">{{ 'Status' }}</p>
            </div>
            <div class="table__cell table__cell--centered-content table__cell--no-padding table__cell--quarter">
              <RadialProgressBar
                  :percentage="contractsFilledPercentage(jobpost)"
                  :diameter="48"
                  :stroke-width="3"
                  :inner-stroke-width="2"
                  start-color="#4d0051"
                  stop-color="#4d0051"
                  unfilled-color="#c4b3c4"
              />
              <p
                  :class="[
            `table__text`,
            `table__text--centered-absolute`,
            { 'table__text--smaller': jobpost.number_of_required_candidates > 9 }
          ]"
              >
                {{ jobpost.contracts_count }}/{{ jobpost.number_of_required_candidates }}
              </p>
            </div>
            <div class="table__cell table__cell--centered-content table__cell--no-padding table__cell--quarter">
              <p class="table__text table__text--color table__text--primary table__text--centered">
                <strong v-if="hasPendingApplications(jobpost)" class="table__text--reactions">{{
                    jobpost.pending_applications
                  }}</strong>
                <template v-else-if="windowWidth <= desktopBreakpoint">-</template>
              </p>
            </div>
            <div class="table__cell table__cell--centered-content table__cell--no-padding table__cell--quarter">
              <p
                  :class="[
            'table__text table__text--centered table__text--primary-desktop',
            { 'table__text--grey': isInactive, 'table__text--color': !isInactive && (isOpen || hasPendingApplications) }
          ]"
              >
                <strong>{{ $t(getJobStatus(jobpost.status)) }}</strong>
              </p>
            </div>
            <NuxtLink
                class="table__item-options table__cell table__cell--centered-content table__cell--no-padding table__cell--quarter"
                @click="goToEdit(jobpost, $event)"
                v-if="jobpost.status !== 'archived'"
            >
              <i class="far fa-pencil text-xl"></i>
            </NuxtLink>
          </div>
          <div v-if="windowWidth >= desktopBreakpoint" class="table__column table__column--narrow desktop-only">
            <i v-click-outside="hideOptions" class="fas fa-ellipsis-v table__ellipsis" @click="toggleOptions"></i>
          </div>
          <ul v-if="showOptions" class="table__item-options">
            <div>
              <p class="table__item-option" @click="goToShift(jobpost)">
                {{ $t('Bekijk') }}
              </p>
            </div>
            <div>
              <p
                  :class="[
                        'table__item-option',
                        { 'table__item-option--disabled': !hasPendingApplications || (!isOffline && !isOpen) }
                    ]"
                  @click="goToReactions(jobpost)"
              >
                {{ $t('Bekijk reacties') }}
              </p>
            </div>
          </ul>
        </div>

      </div>

      <button v-if="employerHasVacancies && vacancies.length" class="mt-5 btn background-default" @click="loadMore"
              :class="canLoadMoreVacancies ? '' : 'disabled'" :disabled="!canLoadMoreVacancies">{{ $t('Load more') }}
      </button>

    </div>
  </main>
</template>

<script setup>
import { formatDate, formatWage } from '@/helpers/stringHelpers';

definePageMeta({
  middleware: 'auth',
  layout: 'account',
  title: 'Mijn vacatures',
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

let status = ref(route.query.status ?? null);

const user = await userStore.fetchUser();

let pageSize = 10;
let per_page = ref(pageSize);
let canLoadMoreVacancies = ref(false);

const vacancyCountResponse = await useRWApi(`/employer/${user.employer_user.employer.id}/job_posts`, {
  method: 'GET',
  query: {
    'filter[status]': '',
  },
});
let employerHasVacancies = vacancyCountResponse.data.length;

let vacancies = ref();
try {
  const vacancyData = await useRWApi(`/employer/${user.employer_user.employer.id}/job_posts`, {
    method: 'GET',
    query: {
      'filter[status]': status.value === 'all' ? null : status.value,
      'per_page': per_page.value,
    },
  });
  vacancies.value = vacancyData.data;
  if (vacancyData.meta.current_page !== vacancyData.meta.last_page) {
    canLoadMoreVacancies.value = true;
  }
} catch (err) {
  console.log('err', err);
}

let loadMore = async () => {
  per_page.value += pageSize;
  canLoadMoreVacancies.value = false;
  try {
    const vacancyData = await useRWApi(`/employer/${user.employer_user.employer.id}/job_posts`, {
      method: 'GET',
      query: {
        'filter[status]': status.value === 'all' ? null : status.value,
        'per_page': per_page.value,
      },
    });
    vacancies.value = vacancyData.data;
    if (vacancyData.meta.current_page !== vacancyData.meta.last_page) {
      canLoadMoreVacancies.value = true;
    }
  } catch (err) {
    console.log('err', err);
  }
};

let showOptions = ref(false);
let desktopBreakpoint = 992;

if (typeof window !== 'undefined') {
  let windowWidth = window.innerWidth;
} else {
  let windowWidth = 1000;
}

let sortColumn = ref('date');
let sortDirection = ref('asc');

let sortBy = (column) => {
  sortColumn.value = column;
  vacancies.value = vacancies.value.sort((a, b) => {
    // Sort by function
    if (sortColumn.value === 'function') {
      if (sortDirection.value === 'asc') {
        return a.function.name < b.function.name;
      } else {
        return a.function.name > b.function.name;
      }
    }
    // Sort by date
    if (sortColumn.value === 'date') {
      if (sortDirection.value === 'asc') {
        return a.start_date < b.start_date;
      } else {
        return a.start_date > b.start_date;
      }
    }
    // Sort by time
    if (sortColumn.value === 'time') {
      if (sortDirection.value === 'asc') {
        return a.start_date < b.start_date;
      } else {
        return a.start_date > b.start_date;
      }
    }
    // Sort by employees
    if (sortColumn.value === 'employees') {
      if (sortDirection.value === 'asc') {
        return a.application_count < b.application_count;
      } else {
        return a.application_count > b.application_count;
      }
    }
    // Sort by reactions
    if (sortColumn.value === 'reactions') {
      if (sortDirection.value === 'asc') {
        return a.pending_applications < b.pending_applications;
      } else {
        return a.pending_applications > b.pending_applications;
      }
    }
    // Sort by status
    if (sortColumn.value === 'status') {
      if (sortDirection.value === 'asc') {
        return a.status < b.status;
      } else {
        return a.status > b.status;
      }
    }
  });
  if (sortDirection.value === 'asc') {
    sortDirection.value = 'desc';
  } else {
    sortDirection.value = 'asc';
  }
};

// Sort by default per date
sortBy('date');

let setStatus = async (_status) => {
  per_page.value = pageSize;
  status.value = _status;
  await router.push({
    path: route.path,
    query: {
      status: status.value,
    },
  });
  const vacancyData = await useRWApi(
      `/employer/${user.employer_user.employer.id}/job_posts`,
      {
        method: 'GET',
        query: {
          'filter[status]': status.value === 'all' ? null : status.value,
          'per_page': per_page.value,
        },
      },
  );
  vacancies.value = vacancyData.data;
  if (vacancyData.meta.current_page !== vacancyData.meta.last_page) {
    canLoadMoreVacancies.value = true;
  }
};

let goToShift = (jobpost) => {
  router.push({
    path: `${route.path}/jobposts/${jobpost.function_template.id}/${jobpost.id}`,
  });
};

let goToEdit = (jobpost, event) => {
  event.stopPropagation();
  router.push({
    path: `${route.path}/edit-vacancy/${jobpost.function_template.id}/${jobpost.id}`,
  });
};

let goToReactions = (jobpost) => {
  router.push({
    path: `/my-account/employer/reactions?jobpost=${jobpost.id}`,
  });
};

let hasPendingApplications = (jobpost) => {
  return jobpost.pending_applications > 0;
};
const isGig = (jobpost) => {
  return jobpost.type === 'gig';
};

let contractsFilledPercentage = (jobpost) => {
  const percentage = (jobpost.contracts_count / jobpost.number_of_required_candidates) * 100;
  return percentage >= 100 ? 100 : percentage;
};

let isFilled = (jobpost) => {
  return jobpost.contracts_count >= jobpost.number_of_required_candidates;
};

let isInactive = (jobpost) => {
  return ['offline', 'archived'].includes(jobpost.status);
};
let isOffline = (jobpost) => {
  return jobpost.status === 'offline';
};
let isOpen = (jobpost) => {
  return jobpost.status === 'open';
};

let startTime = (jobpost) => {
  return jobpost.start_time ? jobpost.start_time[0] : jobpost.schedule[0].start;
};
let endTime = (jobpost) => {
  return jobpost.end_time ? jobpost.end_time[0] : jobpost.schedule[0].end;
};
let wage = (jobpost) => {
  return formatWage(jobpost.hourly_wage);
};

let hideOptions = () => {
  showOptions = false;
};

const date = (jobpost) => {
  return isGig(jobpost)
      ? formatDate(jobpost.start_date || jobpost.schedule[0].date, 'short', 'en-EN')
      : [
        formatDate(jobpost.start_date || jobpost.schedule[0].date, 'short', 'en-EN'),
        formatDate(jobpost.end_date || jobpost.schedule[-1].date, 'short', 'en-EN'),
      ];
};

const getJobStatus = (status) => {
  if(status === 'archived') {
    return 'Gearchiveerd';
  }
  if(status === 'filled') {
    return 'Vervuld';
  }
  if(status === 'started') {
    return 'Gestart';
  }
  if(status === 'open') {
    return 'Open';
  }
  if(status === 'offline') {
    return 'Offline';
  }
  if(status === 'all') {
    return 'Alles';
  }
}
</script>