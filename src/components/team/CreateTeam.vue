<template>
  <div class="create-team-form-wrapper">
  <el-form :model="form" label-width="120px">
    <el-form-item label="团队名">
      <el-input v-model="form.name" />
    </el-form-item>
    <!-- <el-form-item label="Activity zone">
      <el-select v-model="form.region" placeholder="please select your zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date1"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
      <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-time-picker
          v-model="form.date2"
          placeholder="Pick a time"
          style="width: 100%"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="Instant delivery">
      <el-switch v-model="form.delivery" />
    </el-form-item>
    <el-form-item label="Activity type">
      <el-checkbox-group v-model="form.type">
        <el-checkbox label="Online activities" name="type" />
        <el-checkbox label="Promotion activities" name="type" />
        <el-checkbox label="Offline activities" name="type" />
        <el-checkbox label="Simple brand exposure" name="type" />
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group v-model="form.resource">
        <el-radio label="Sponsor" />
        <el-radio label="Venue" />
      </el-radio-group>
    </el-form-item> -->
    <el-form-item label="团队描述">
      <el-input v-model="form.description" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="createTeam">创建</el-button>
      <el-button @click="emitter.emit('setTeamOption', 'teamInfo')">取消</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
export default {
  name: 'CreateTeam',
}
</script>

<script setup>
import { ref } from 'vue'
import emitter from '@/utils/emitter'
import { createOrg } from '@/api/org'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user' 
import { useRouter } from 'vue-router'

const form = ref({
  name: '',
  description: '',
})

const router = useRouter()
const userStore = useUserStore()

const createTeam = async () => {
  // TODO
  try {
    const res = await createOrg(form.value)
    console.log(res)
    if (res.meta.status == 0) {
      ElMessage({
        type: 'success',
        message: '创建成功'
      })
      userStore.setOrgId(res.data.id)
      router.push({
        name: 'team',
      })
      return res
    }
  } catch (e) {
    console.log(e)
  }
}
</script>

<style scoped>
.create-team-form-wrapper {
  border-radius: 0.25rem;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  padding: 1.5rem;
}
</style>