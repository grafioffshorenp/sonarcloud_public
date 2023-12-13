<template>
  <div v-if="conversation" class="c-conversation">
    <div class="c-conversation__inner">
      <NotificationBadge :counter="conversation.unread_messages_count" position="bottom-right">
        <Avatar :image="user.avatar">
          <!-- Fallback content -->
          <Icon v-if="isEmployee" fa-class="fas fa-building" size="large"/>
          <Icon v-else fa-class="fas fa-user" size="large"/>
        </Avatar>
      </NotificationBadge>

      <div class="c-conversation__content">
        <Heading element="h3" as="h4" :modifiers="['sub-title', 'line-height-small']">{{ user.name }}</Heading>
        <TextElement element="p" :modifiers="['line-height-normal']">{{
            conversation.function_template.function.name
          }}
        </TextElement>
        <TextElement element="p" :modifiers="['line-height-normal']">
          {{ conversation.employer_location.city }}
        </TextElement>
      </div>
    </div>
    <div class="c-conversation__date">
      <TextElement element="small" :modifiers="['line-height-normal', 'grey']">
        {{ lastCreatedAtDate }}
      </TextElement>
    </div>
  </div>
</template>

<script>
import Heading from '../atoms/Heading';
import Avatar from '../atoms/Avatar';
import Icon from '../atoms/Icon';
import TextElement from '../atoms/TextElement';
import NotificationBadge from '../atoms/NotificationBadge';
import { getCreatedAtDate } from '@/helpers/dateHelpers';

export default {
  name: 'Conversation',
  components: { Heading, Avatar, Icon, TextElement, NotificationBadge },
  props: {
    conversation: {
      default: null,
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
    lastCreatedAtDate() {
      const yesterdayLabel = this.$t('Gisteren');

      if (!this.conversation.latest_message) {
        return getCreatedAtDate(this.conversation.created_at, yesterdayLabel);
      }

      return getCreatedAtDate(this.conversation.latest_message.created_at, yesterdayLabel);
    },
    user() {
      if (this.isEmployee) {
        return {
          name: this.conversation.employer.name,
          avatar: this.conversation.employer.logo,
        };
      }

      if (this.conversationStatus === 'pending') {
        return {
          name: this.$t('Anoniem profiel'),
          avatar: null,
        };
      }

      return {
        name: `${this.conversation.employee.first_name} ${this.conversation.employee.last_name}`,
        avatar: this.conversation.employee.profile_picture,
      };
    },
    conversationStatus() {
      return this.isEmployee ? this.conversation.employee_status : this.conversation.employer_status;
    },
  },
};
</script>

<style lang="scss" scoped>
.c-conversation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  padding: 1rem 1.5rem;
  width: 100%;
}

.c-conversation__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.c-conversation__content {
  text-align: left;
}

.c-conversation__date {
  align-self: flex-start;

  min-width: 4rem;
}
</style>
