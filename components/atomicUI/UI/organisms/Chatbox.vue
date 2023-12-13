<template>
  <div class="c-chatbox">
    <div v-show="messages && conversation" class="c-chatbox__inner">
      <div v-if="conversation">
        <ChatboxHeader
            :conversation-state="conversationState"
            :user="user"
            @onButtonBackClick="buttonBackClickHandler"
            @onButtonArchiveClick="buttonArchiveConversationHandler"
        />
      </div>

      <div v-if="messages">
        <div v-if="messages.data.length || conversationState === 'pending'" class="u-mt-medium">
          <ConversationNotificationMessageWrapper :conversation="conversation"/>
        </div>

        <div v-else>
          <div class="c-chatbox__notification-wrapper">
            <NotificationMessage
                :message="{
                title: $t('Nog geen berichten om te laten zien'),
                text: $t('Verstuur een bericht via het formulier hier onder')
              }"
                severity="low"
                rounded
            />
          </div>
        </div>
      </div>

      <div ref="messageContainer" class="c-chatbox__message-container">
        <div v-if="messages">
          <ol v-if="messages.data.length" class="c-chatbox__messages">
            <li v-for="message in messages.data" ref="messages" :key="message.id" :data-id="message.id">
              <ChatMessage :message="message"/>
            </li>
          </ol>

          <ConfirmDeclineBox
              v-if="isEmployee && conversationState === 'pending'"
              :confirm-button-text="$t('Conversatie starten')"
              :decline-button-text="$t('Conversatie afwijzen')"
              @confirm="startConversationHandler"
              @decline="declineConversationHandler"
          >
            <template #modal>
              <h3 class="modal__title u-text-align-left u-mb-medium">
                {{ $t('Weet je zeker dat je het verzoek wilt afwijzen?') }}<br/>
                {{ $t('Het verzoek zal permanent worden verwijderd') }}
              </h3>

              <p class="u-text-align-left">{{ $t('Klik op annuleren om het verzoek te bekijken.') }}</p>
            </template>
          </ConfirmDeclineBox>
        </div>
      </div>

      <div class="c-chatbox__type-message-box">
        <NotificationMessage
            :message="{ text: $t('Let op! Deel nooit je gegevens...') }"
            severity="warning"
            close-button
                    wide
                />

                <NotificationMessage
                    v-if="errorMessage"
                    :message="{ text: $t(errorMessage) }"
                    severity="error"
                    close-button
                    wide
                />

                <TypeMessageBox :disabled="!allowedToSendMessage" @onMessageSend="messageSendHandler"/>
              </div>
      </div>

      <div v-show="!messages || !conversation">
        <div class="c-chatbox__go-back">
          <go-back @onButtonBackClick="buttonBackClickHandler"/>
        </div>
        <div class="u-mt-small u-mb-small">
          <NotificationMessage
              :message="{
                title: $t('Nog geen berichten om te laten zien'),
                text: $t('Klik op een gesprek om te chatten ')
              }"
              severity="default"
              rounded
          />
        </div>
      </div>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';
import ChatboxHeader from '../molecules/ChatboxHeader';
import NotificationMessage from '../molecules/NotificationMessage';
import ChatMessage from '../molecules/ChatMessage';
import TypeMessageBox from '../molecules/TypeMessageBox';
import GoBack from '../molecules/GoBack';
import ConversationNotificationMessageWrapper from '../molecules/ConversationNotificationMessageWrapper';
import ConfirmDeclineBox from '../molecules/ConfirmDeclineBox';

export default {
  name: 'Chatbox',
  components: {
    ConfirmDeclineBox,
    ConversationNotificationMessageWrapper,
    ChatboxHeader,
    NotificationMessage,
    ChatMessage,
    TypeMessageBox,
    GoBack,
  },
  props: {
    conversation: {
      default: null,
      type: Object,
    },
    messages: {
      default: null,
      type: Object,
    },
    errorMessage: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      isSendingMessage: false,
      unreadMessageCounter: null,
      userStore: useUserStore(),
    };
  },
  computed: {
    isEmployee() {
      return this.userStore.isEmployee;
    },
    conversationState() {
      if (!this.conversation) {
        return;
      }
      const status = this.isEmployee ? 'employee_status' : 'employer_status';

      return this.conversation[status];
    },
    user() {
      return this.isEmployee ? this.getEmployerInfo() : this.getEmployeeInfo();
    },
    allowedToSendMessage() {
      return ['active', 'archived'].includes(this.conversationState);
    },
  },
  watch: {
    messages(_, oldMessages) {
      // Scroll to bottom first time we have received messages
      if (oldMessages === null) {
        this.scrollToBottomMessageBox();
      }
      // Scroll to first message before we have received the new messages
      else if (!this.isSendingMessage && this.$refs.messages) {
        const pageAmount = oldMessages.meta.to - oldMessages.meta.from + 1;
        const firstMessageBeforeUpdate = this.$refs.messages[oldMessages.data.length - pageAmount];

        this.scrollToMessage(firstMessageBeforeUpdate);
      }
    },
  },
  updated() {
    if (this.isSendingMessage) {
      this.isSendingMessage = false;
      this.scrollToBottomMessageBox();
    }
  },
  mounted() {
    this.setupInfinitescroll();
  },
  methods: {
    setupInfinitescroll() {
      const container = this.$refs.messageContainer;

      if (container) {
        container.addEventListener('scroll', debounce(this.scrollHandler, 300));
      }
    },
    killInfiniteScroll() {
      const container = this.$refs.messageContainer;

      if (container) {
        container.removeEventListener('scroll', debounce(this.scrollHandler, 300));
      }
    },
    getEmployerInfo() {
      return {
        name: this.conversation.employer.name,
        avatar: this.conversation.employer.logo,
      };
    },
    getEmployeeInfo() {
      return {
        name: this.getEmployeeFullName(),
        avatar: this.conversation.employee.profile_picture,
        ...(this.conversation.employee.id && { url: this.getApplicantUrl(this.conversation.employee.id) }),
      };
    },
    getEmployeeFullName() {
      if (this.conversationState === 'pending') {
        return this.$t('Anoniem profiel');
      }

      const firstName = this.conversation.employee.first_name ? this.conversation.employee.first_name : '';
      const lastName = this.conversation.employee.last_name ? this.conversation.employee.last_name : '';

      return `${firstName} ${lastName}`.trim();
    },
    getApplicantUrl(id) {
      return `/my-account/employer/employee/${id}`;
    },
    scrollToMessage(message) {
      if (message) {
        message.scrollTo();
        // this.$refs.messageContainer.scrollTo()
        // const options = {
        //   container: this.$refs.messageContainer,
        //   duration: 0,
        //   easing: 'none',
        //   lazy: false,
        // };

        // this.$scrollTo(message, options);
      }
    },
    scrollToBottomMessageBox() {
      const container = this.$refs.messageContainer;

      if (container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 100);
      }
    },
    scrollHandler() {
      const container = this.$refs.messageContainer;

      if (container.scrollTop === 0) {
        this.$emit('onScrollReachedTop');
      }
    },
    buttonBackClickHandler() {
      // Switch layout to sidebar panel
      this.$emit('onButtonBackClick', 'sidebar');
    },
    buttonArchiveConversationHandler() {
      const status = this.isEmployee ? 'employee_status' : 'employer_status';
      const action = this.conversation[status] === 'active' ? 'archived' : 'active';
      this.$emit('onConversationStateChange', this.conversation.id, action);
    },
    messageSendHandler(message) {
      this.$emit('onSendMessage', message);
      this.isSendingMessage = true;
    },
    startConversationHandler() {
      this.$emit('onConversationStart', this.conversation.id);
    },
    declineConversationHandler() {
      this.$emit('onConversationDecline', this.conversation.id);
    },
  },
  beforeUnmount() {
    this.killInfiniteScroll();
  },
};
</script>

<style lang="scss" scoped>
.c-chatbox__inner {
  height: calc(100vh - 120px);

  @include tablet {
    height: calc(100vh - 130px);
  }

  @include desktop {
    height: 100%;
  }
}

.c-chatbox__message-container {
  left: -1.5rem;

  padding-bottom: 1rem;
  height: calc(100vh - 355px);
  width: calc(100% + 3rem);

  overflow-y: scroll;

  @include desktop {
    left: initial;

    width: 100%;
    height: 368px;
    padding: 0;
  }
}

.c-chatbox__messages {
  margin: 0;

  list-style-type: none;
}

.c-chatbox__go-back {
  margin-top: 2rem;

  @include desktop {
    display: none;
  }
}

.c-chatbox__notification-wrapper {
  margin: 1rem 0;
}

.c-chatbox__type-message-box {
  position: absolute;
  bottom: 0;
  z-index: 1;

  width: 100%;

  @include desktop {
    position: relative;
  }
}
</style>
