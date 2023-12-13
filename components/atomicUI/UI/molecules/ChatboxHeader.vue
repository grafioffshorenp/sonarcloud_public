<template>
  <header class="c-chatbox-header">
    <div class="c-chatbox-header__back-button">
      <IconButton fa-class="fas fa-arrow-left" :aria-label="$t('Ga terug')" :handler="onButtonBackClick"/>
    </div>

    <Avatar v-if="user && conversationState !== 'pending'" :image="user.avatar" size="small">
      <!-- Fallback content -->
      <Icon fa-class="fas fa-user" size="large"/>
    </Avatar>

    <div class="c-chatbox-header__actions">
      <div>
        <Heading v-if="user && user.name" element="h3" as="h4" :modifiers="['text', 'sub-title']">{{
            user.name
          }}
        </Heading>

        <div v-if="user && user.url" class="u-mt-small">
          <a :href="user.url" target="_blank" class="c-chatbox-header__link">{{ $t('View profile') }}</a>
        </div>
      </div>

      <RWButton v-if="['active', 'archived'].includes(conversationState)" as="link"
                :handler="onButtonArchiveConversationHandler">
        <span v-if="conversationState === 'active'">
          {{ $t('Gesprek archiveren') }}
        </span>

        <span v-else-if="conversationState === 'archived'">
          {{ $t('Gesprek onarchiveren') }}
        </span>
      </RWButton>
    </div>
  </header>
</template>

<script>
import IconButton from '../atoms/IconButton';
import Avatar from '../atoms/Avatar';
import Icon from '../atoms/Icon';
import Heading from '../atoms/Heading';
import RWButton from '../atoms/RWButton.vue';

export default {
  name: 'ChatboxHeader',
  components: { Avatar, Icon, IconButton, Heading, RWButton },
  props: {
    conversationState: {
      required: true,
      type: String,
    },
    user: {
      default: null,
      type: Object,
    },
  },
  methods: {
    onButtonBackClick() {
      this.$emit('onButtonBackClick');
    },
    onButtonArchiveConversationHandler() {
      this.$emit('onButtonArchiveClick');
    },
  },
};
</script>

<style lang="scss" scoped>
.c-chatbox-header {
  display: flex;
  gap: 0.5rem;

  padding: 1.5rem 0 0.5rem;
  width: 100%;
}

.c-chatbox-header__back-button {
  display: flex;

  @include desktop {
    display: none;
  }
}

.c-chatbox-header__actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;

  margin-left: 0.5rem;

  .c-button {
    color: $grey;
    width: auto;
  }

  @include desktop {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
  }
}

.c-chatbox-header__link {
  color: $teal-dark;
}

</style>
