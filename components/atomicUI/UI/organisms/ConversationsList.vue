<template>
  <div class="c-conversations-list">
    <TabsMenu :tabs="tabs" @callback="tabChangeHandler"/>
    <div ref="conversationContainer" class="c-conversations-list__content">
      <ol v-if="sortedConversations.length" class="c-conversations-list__conversations">
        <li
            v-for="conversation in sortedConversations"
            :key="conversation.id"
            class="c-conversations-list__item"
            :class="{
            'c-conversations-list__item--is-selected': conversation.id === selectedConversationId
          }"
        >
          <button class="c-conversations-list__select" @click="buttonClickHandler(conversation)">
            <Conversation :conversation="conversation"/>
          </button>
        </li>
      </ol>
      <div v-else class="c-conversations-list__zero-state-message">
        <NotificationMessage
            :message="{
            title: $t('Nog geen berichten om te laten zien'),
            text: $t('Lorem ipsum...')
          }"
            severity="default"
            rounded
        />
      </div>
    </div>
  </div>
</template>

<script>
import pkg from 'lodash';
const { debounce } = pkg;
import Conversation from '../molecules/Conversation';
import TabsMenu from '../molecules/TabsMenu';
import NotificationMessage from '../molecules/NotificationMessage.vue';

export default {
  name: 'ConversationsList',
  components: { Conversation, TabsMenu, NotificationMessage },
  props: {
    conversations: {
      default: null,
      type: Object,
    },
    selectedConversationId: {
      default: null,
      type: Number,
    },
  },
  data() {
    return {
      activeTab: null,
      userStore: useUserStore(),
    };
  },
  computed: {
    isEmployee() {
      return this.userStore.isEmployee;
    },
    isEmployer() {
      return this.userStore.isEmployer;
    },
    tabs() {
      return [
        { value: 'active', name: this.$t('Inbox') },
        {
          value: 'pending',
          name: this.isEmployer ? this.$t('In afwachting') : this.$t('Verzoeken'),
        },
        { value: 'archived', name: this.$t('Gearchiveerd') },
      ];
    },
    activeConversations() {
      if (!this.conversations) {
        return [];
      }

      const status = this.isEmployee ? 'employee_status' : 'employer_status';

      const sortedConversations = this.conversations.data.slice().sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      return sortedConversations.filter(conversation => conversation[status] === this.activeTab);

    },
    sortedConversations() {
      return this.activeConversations.sort((a, b) => {
        const dateA = new Date(a.latest_message.created_at);
        const dateB = new Date(b.latest_message.created_at);

        if (dateA.getTime() === dateB.getTime()) {
          // If dates are equal, compare by time
          return dateB - dateA;
        }

        // Compare timestamps in descending order
        return dateB.getTime() - dateA.getTime();
      });
    }
  },
  mounted() {
    this.activeTab = this.tabs[0].value;
    this.setupInfinitescroll();
  },
  methods: {
    setupInfinitescroll() {
      const container = this.$refs.conversationContainer;

      if (container) {
        container.addEventListener('scroll', debounce(this.scrollHandler, 300));
      }
    },
    killInfiniteScroll() {
      const container = this.$refs.conversationContainer;

      if (container) {
        container.removeEventListener('scroll', debounce(this.scrollHandler, 300));
      }
    },
    scrollHandler() {
      const container = this.$refs.conversationContainer;

      if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        this.$emit('onScrollReachedBottom');
      }
    },
    tabChangeHandler(tab) {
      this.activeTab = tab;

      this.$emit('onTabChange', this.activeTab);
    },
    buttonClickHandler(conversation) {
      // Switch layout to main panel
      this.$emit('onButtonBackClick', 'main');

      this.$emit('onConversationSelectChange', conversation.id);
    },
  },
  beforeUnmount() {
    this.killInfiniteScroll();
  },
};
</script>

<style lang="scss" scoped>
.c-conversations-list__content {
  margin-top: 0.25rem;
  height: calc(100vh - 120px);
  overflow-y: auto;

  @include desktop {
    height: 570px;
  }
}

.c-conversations-list__conversations {
  list-style-type: none;
}

.c-conversations-list__item {
  cursor: pointer;

  &--is-selected {
    background: $background-light;
  }
}

.c-conversations-list__select {
  width: 100%;
}

.c-conversations-list__zero-state-message {
  margin: 0 0.5rem;

  @include desktop {
    display: none;
  }
}
</style>
