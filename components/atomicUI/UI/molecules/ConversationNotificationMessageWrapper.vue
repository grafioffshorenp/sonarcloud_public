<template>
  <div v-if="showNotificationMessage">
    <NotificationMessage
        :message="message"
        :severity="severity"
        :detail-link="detailLink"
        rounded-desktop-only
        wide-mobile-only
    />
  </div>
</template>

<script>
import NotificationMessage from '../molecules/NotificationMessage';
import { buildFunctionTemplateURLForConversation } from '@/helpers/stringHelpers';

export default {
  name: 'ConversationNotificationMessageWrapper',
  components: { NotificationMessage },
  props: {
    conversation: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      userStore: useUserStore(),
    };
  },
  computed: {
    isEmployee() {
      return this.userStore.isEmployee;
    },
    showNotificationMessage() {
      return true;
    },
    conversationState() {
      if (this.isEmployee) {
        return this.conversation.employee_status;
      }

      return this.conversation.employer_status;
    },
    severity() {
      if (['archived', 'declined'].includes(this.conversationState)) {
        return 'warning';
      }

      return 'low';
    },
    detailLink() {
      if (!this.isEmployee || this.conversationState === 'archived') {
        return;
      }

      return {
        url: buildFunctionTemplateURLForConversation(this.conversation),
        text: this.$t('Bekijk functie'),
        target: '_blank',
      };
    },
    functionName() {
      if (!this.conversation.function_template) {
        return;
      }

      return this.conversation.function_template.function.name;
    },
    functionCity() {
      return this.conversation.employer_location.city;
    },
    message() {
      if (!['active', 'pending', 'archived'].includes(this.conversationState)) {
        return;
      }

      return this[`${this.conversationState}Message`];
    },
    activeMessage() {
      if (this.isEmployee) {
        return {
          title: this.$t('Je hebt gereageerd op de volgende functie'),
          text: `${this.functionName}, ${this.functionCity}`,
        };
      }

      return {
        title: this.$t('Heeft gereageerd op de volgende functie'),
        text: `${this.functionName}, ${this.functionCity}`,
      };
    },
    archivedMessage() {
      return {
        text: this.$t(
            'Dit gesprek is gearchiveerd. Verstuur een bericht om het gesprek te hervatten.',
        ),
      };
    },
    pendingMessage() {
      if (this.isEmployee) {
        return {
          title: this.$t('{name} heeft een contactverzoek gedaan', '{name} heeft een contactverzoek gedaan', {
            named: { name: this.conversation.employer.name },
          }),
          text: `${this.functionName}, ${this.functionCity}`,
        };
      }

      return {
        title: this.$t('Contactverzoek voor functie: {name}', 'Contactverzoek voor functie: {name}', {
          named: {
            name: this.functionName,
          },
        }),
        text: this.$t(
            'Nadat de werknemer het conversatieverzoek heeft geaccepteerd, kun je dit hier terugzien.',
        ),
      };
    },
    declinedMessage() {
      return {
        title: this.$t('Contactverzoek afgewezen: {name}', {
          params: {
            name: this.functionName,
          },
        }),
        text: this.$t(
            'Je hebt dit contactverzoek afgewezen. Er kunnen geen acties worden gedaan op een afgewezen contactverzoek.',
        ),
      };
    },
  },
};
</script>
