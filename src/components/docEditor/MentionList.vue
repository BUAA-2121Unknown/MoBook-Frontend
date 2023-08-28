<template>
  <div class="items">
    <template v-if="items.length">
      <button
        class="item"
        :class="{ 'is-selected': index === selectedIndex }"
        v-for="(item, index) in items"
        :key="index"
        @click="selectItem(index)"
      >
        {{ item }}
      </button>
    </template>
    <div class="item" v-else>
      No result
    </div>
  </div>
</template>

<script>
import { getOrgAllMemberInfo } from '@/api/org'
import { useUserStore } from '@/stores/modules/user'
import { onMounted, ref } from 'vue'
import { mention } from '@/api/artifact'

const userStore = useUserStore()
export default {
  props: {
    // items: {
    //   type: Array,
    //   required: true,
    // },

    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
      items: [],
      members: [],
      formData: {
        orgId: '',
      },
      mentionFormData: {
        projId: '',
        artId: '',
        users: []
      }
    }
  },

  watch: {
    items() {
      this.selectedIndex = 0
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        this.downHandler()
        return true
      }

      if (event.key === 'Enter') {
        this.enterHandler()
        return true
      }

      return false
    },

    upHandler() {
      this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length
    },

    enterHandler() {
      this.selectItem(this.selectedIndex)
    },

    async selectItem(index) {
      const member = this.members[index]
      if (member) {
        this.command({ id: member.username })
      }
      this.mentionFormData.projId = userStore.projectId
      this.mentionFormData.artId = parseInt(this.$route.query.doc_id)
      this.mentionFormData.users.push(member.id)
      console.log(this.mentionFormData)
      const res = await mention(this.mentionFormData)
      if (res.data.status == 0) {
        console.log(res)
      } else {
        console.log(res)
      }
    },

    async getAllMembers() {
      try {
        this.formData.orgId = userStore.orgId
        const orgMembers = await getOrgAllMemberInfo(this.formData)
        if (orgMembers.meta.status == 0) {
          this.items = orgMembers.data.members.map(item => item.user.username)
          this.members = orgMembers.data.members.map(item => item.user)
        } else {
          console.log(orgMembers)
        }
      } catch(e) {
        console.log(e)
      }
    }
  },
  mounted(){
    this.getAllMembers()
  }
}
</script>

<style lang="scss">
.items {
  padding: 0.2rem;
  position: relative;
  border-radius: 0.5rem;
  background: #FFF;
  color: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  font-size: 0.9rem;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0px 10px 20px rgba(0, 0, 0, 0.1),
  ;
}

.item {
  display: block;
  margin: 0;
  width: 100%;
  text-align: left;
  background: transparent;
  border-radius: 0.4rem;
  border: 1px solid transparent;
  padding: 0.2rem 0.4rem;

  &.is-selected {
    border-color: #000;
  }
}
</style>