<template>
  <div
      class="c-chat-message"
      :class="{
      'c-chat-message--bg-grey': message.owner_type === user.role || message.owner_type === `${user.role}_user`
    }"
  >
    <header class="c-chat-message__header">
      <hgroup class="c-chat-message__headings">
        <Heading element="h3" as="h4" :modifiers="['line-height-small', 'sub-title', 'teal']">
          {{ sender }}
        </Heading>

        <div v-if="message.owner_type === 'employee'" class="c-chat-message__function-description">
          <Heading element="h3" as="h4" :modifiers="['line-height-small', 'sub-title', 'text']">
            {{ $t('Opmerking over') }}: {{ message.conversation.function_template.function.name }}
          </Heading>
        </div>

        <div v-else-if="conversationStatus === 'pending'" class="c-chat-message__function-description">
          <Heading element="h3" as="h4" :modifiers="['line-height-small', 'sub-title', 'text']">
            {{ $t('Verzoek/uitnodiging') }}: {{ message.conversation.function_template.function.name }}
          </Heading>
        </div>
      </hgroup>

      <div class="c-chat-message__time">
        <TextElement element="small" :modifiers="['grey']">{{ lastCreatedAtDate }}</TextElement>
      </div>
    </header>

    <TextElement class="translate multiline" element="p">{{ message.message }}</TextElement>
  </div>
</template>

<script>
/**
 * Props
 * message {
 *  sender: String,
 *  timestamp: Number
 *  text: String
 * }
 * function: {
 *  shift: String,
 *  employer: String
 * }
 */

import Heading from '../atoms/Heading';
import TextElement from '../atoms/TextElement';
import { getCreatedAtDate } from '@/helpers/dateHelpers';

export default {
  name: 'ChatMessage',
  components: { Heading, TextElement },
  props: {
    message: {
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
    user() {
      return this.userStore.user;
    },
    sender() {
      return this.message[`sender_${this.message.owner_type}`].full_name;
    },
    lastCreatedAtDate() {
      const yesterdayLabel = this.$t('Gisteren');
      return getCreatedAtDate(this.message.created_at, yesterdayLabel);
    },
    conversationStatus() {
      // dependant on current user:
      // Either employee_status or employer_status is available
      if (this.message.conversation.employee_status) {
        return this.message.conversation.employee_status;
      }

      return this.message.conversation.employer_status;
    },
  },
};
</script>

<style lang="scss" scoped>
.c-chat-message {
  margin: 1rem 0;
  padding: 0 1.5rem;

  &--bg-grey {
    padding: 1rem 1.5rem;

    background-color: $lightest-grey-alt;
  }

  @include desktop {
    padding: 0 1rem;

    &--bg-grey {
      left: initial;

      padding: 1rem;
      border-radius: 6px;
    }
  }
}

.c-chat-message__header {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.c-chat-message__headings {
  h3 {
    margin-bottom: 0.5rem;
  }
}

.c-chat-message__function-description {
  display: none;

  @include desktop {
    display: block;
  }
}

.multiline {
  white-space: pre-wrap;
}
</style>
