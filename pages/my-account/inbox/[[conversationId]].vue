<template>
  <LayoutSidebar :active-panel="activePanel">
    <template #sidebar>
      <ConversationsList
          :conversations="conversations"
          :selected-conversation-id="selectedConversationId"
          @onScrollReachedBottom="conversationsScrollReachedBottomHandler"
          @onConversationSelectChange="conversationSelectChangeHandler"
          @onTabChange="tabChangeHandler"
          @onButtonBackClick="buttonBackClickHandler"
      />
    </template>

    <template #main>
      <Chatbox
          v-if="selectedConversationId"
          :key="selectedConversationId"
          :conversation="getConversation(selectedConversationId)"
          :messages="messages"
          :error-message="errorMessage"
          @onScrollReachedTop="messagesScrollReachedTopHandler"
          @onButtonBackClick="buttonBackClickHandler"
          @onConversationStart="conversationStartHandler"
          @onConversationDecline="conversationDeclineHandler"
          @onConversationStateChange="conversationStateChangeHandler"
          @onSendMessage="messageSendHandler"
      />
    </template>
  </LayoutSidebar>
</template>

<script>
import Header from '~/components/layout/Header.vue';
import LayoutSidebar from '~/components/atomicUI/templates/LayoutSidebar.vue';
import ConversationsList from '~/components/atomicUI/UI/organisms/ConversationsList.vue';
import Chatbox from '~/components/atomicUI/UI/organisms/Chatbox.vue';
import { useUserStore } from '~/stores/user.js';
import { useRoute } from 'nuxt/app';
import { random } from '~/helpers/stringHelpers.js';
import { sortByLastUpdated } from '~/helpers/dateHelpers.js';

export default {
  setup() {
    definePageMeta({
      layout: 'account',
      title: 'Mijn inbox',
    });
  },
  name: 'Inbox',
  components: { Chatbox, ConversationsList, LayoutSidebar, Header },
  data() {
    return {
      conversations: null,
      messages: {data: []},
      conversationsCurrentPage: 1,
      messagesCurrentPage: 1,
      activeTab: 'active',
      activePanel: 'sidebar',
      selectedConversationId: null,
      errorMessage: null,
      userStore: useUserStore(),
    };
  },
  computed: {
    user() {
      return this.userStore.user;
    },
    isEmployer() {
      return this.userStore.isEmployer;
    },
    isEmployee() {
      return this.userStore.isEmployee;
    },
  },
  async mounted() {
    const route = useRoute();
    await this.userStore.fetchUser();

    await this.getConversations(this.activeTab);
    if (route.params.conversationId) {
      this.conversationSelectChangeHandler(Number(route.params.conversationId));
    }
  },
  methods: {
    getConversation(id) {
      if (this.conversations) {
        return this.conversations.data.find(item => item.id === id);
      }
    },
    getConversations(status, page = 1) {
      // Do not fetch when page limit is reached
      if (this.conversations && page > this.conversations.meta.last_page) {
        return;
      }

      const url = `/${this.user.role}/${this.isEmployer
          ? this.user.employer_user.employer.id
          : this.user.employee.id}/conversations`;
      return useRWApi(url, {
        method: 'GET',
        timeout: 25000,
        query: {
          'filter[status]': status,
          page,
          cbs: random(true),
        },
      }).then(response => {
        if (this.conversations) {
          this.conversations = {
            ...response,
            data: this.getUniqueConversations(response.data),
          };
        } else {
          this.conversations = {
            ...response,
            data: sortByLastUpdated(response.data),
          };
        }
      }).catch(error => {
        this.errorMessage = error.errors.message[0];
      });
    },
    getMessages(page = 1) {
      // Do not fetch when page limit is reached
      if (this.messages && page > this.messages.meta.last_page) {
        return;
      }

      const url = `/${this.user.role}/${this.isEmployer
          ? this.user.employer_user.employer.id
          : this.user.employee.id}/conversations/${this.selectedConversationId}/messages`;

      useRWApi(url, {
        method: 'GET',
        timeout: 25000,
        query: {
          page,
          cbs: random(true),
        },
      }).then(({ data, meta }) => {
        this.messages = {
          meta,
          data: meta.current_page > 1 ? this.getUniqueMessages(data) : sortByLastUpdated(data),
        };
      }).catch(error => {
        this.errorMessage = error.response.errors.message[0];
      });
    },
    getUniqueConversations(newConversations) {
      const uniqueConversations = newConversations.filter(msg => {
        const isInArray = this.conversations.data.find(item => item.id === msg.id);

        if (!isInArray) {
          return msg;
        }

        return null;
      });

      return sortByLastUpdated(this.conversations.data.concat(uniqueConversations));
    },
    getUniqueMessages(newMessages) {
      const uniqueMessages = newMessages.filter(msg => {
        const isInArray = this.messages.data.find(item => item.id === msg.id);

        if (!isInArray) {
          return msg;
        }

        return null;
      });

      return sortByLastUpdated(this.messages.data.concat(uniqueMessages));
    },
    sendMessage(message) {
      const url = `/${this.user.role}/${this.isEmployer
          ? this.user.employer_user.employer.id
          : this.user.employee.id}/conversations/${this.selectedConversationId}/messages`;

      const body = {
        message,
      };

      if (this.isEmployer) {
        body.employer_user_id = this.user.employer_user.id;
      }

      useRWApi(url, {
        method: 'POST',
        query: {
          cbs: random(true),
        },
        body,
      }).then(() => {
        this.getMessages();
      }).catch(error => {
        this.errorMessage = error.response.data.errors.message[0];
      });
    },
    async updateConversation(conversation, payload) {
      const url = `/${this.user.role}/${this.isEmployer
          ? this.user.employer_user.employer.id
          : this.user.employee.id}/conversations/${conversation.id}/status`;

      useRWApi(url, {
        method: 'PATCH',
        query: {
          cbs: random(true),
        },
        body: payload,
      }).catch(error => {
        this.errorMessage = error.response.data.errors.message[0];
      });
    },
    updateConversationState(id, state) {
      const conversation = this.getConversation(id);

      if (conversation) {
        this.updateConversation(conversation, { status: state }).then(() => {
          const status = this.isEmployee ? 'employee_status' : 'employer_status';
          conversation[status] = state;
        });
      }
    },
    loadMoreConversations() {
      this.conversationsCurrentPage++;

      this.getConversations(this.activeTab, this.conversationsCurrentPage);
    },
    loadMoreMessages() {
      this.messagesCurrentPage++;

      this.getMessages(this.messagesCurrentPage);
    },
    messageSendHandler(message) {
      this.sendMessage(message);

      const currentConversation = this.getConversation(this.selectedConversationId);
      const status = this.isEmployee ? 'employee_status' : 'employer_status';

      // Archived conversations will be set to 'active' when a new message is sent
      // Update current conversation state
      if (currentConversation[status] === 'archived') {
        currentConversation[status] = 'active';
      }
    },
    conversationsScrollReachedBottomHandler() {
      this.loadMoreConversations();
    },
    messagesScrollReachedTopHandler() {
      this.loadMoreMessages();
    },
    buttonBackClickHandler(panel) {
      this.activePanel = panel;
    },
    conversationSelectChangeHandler(id) {
      if (this.selectedConversationId !== id) {
        this.selectedConversationId = id;
        this.messages = null;
        this.errorMessage = null;
        this.getMessages();

        const conversation = this.getConversation(id);
        conversation.unread_messages_count = 0;
      }
    },
    tabChangeHandler(tab) {
      this.activeTab = tab;
      this.selectedConversationId = null;
      this.getConversations(this.activeTab);
    },
    conversationStateChangeHandler(id, state) {
      this.updateConversationState(id, state);
    },
    conversationStartHandler(id) {
      // only employee is allowed to start conversation
      if (!this.isEmployee) {
        return;
      }

      const conversation = this.getConversation(id);

      if (conversation) {
        const data = {
          status: 'active',
          employer_status: 'active',
        };

        this.updateConversation(conversation, data).then(() => {
          conversation.employee_status = 'active';
        });
      }
    },
    conversationDeclineHandler(id) {
      // only employee is allowed to decline conversation
      if (!this.isEmployee) {
        return;
      }

      this.updateConversationState(id, 'declined');
    },
  },
};
</script>
