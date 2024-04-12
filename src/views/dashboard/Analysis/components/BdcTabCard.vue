<template>
  <Card title="项目" v-bind="$attrs">
    <template #extra>
      <a-button type="link" size="small">fffffffffffffffff</a-button>
    </template>

    <template v-for="item in items" :key="item">
      <CardGrid class="!md:w-1/3 !w-full">
        <span class="flex">
          <Icon :icon="item.icon" :color="item.color" size="30" />
          <span class="text-lg ml-4">{{ item.title }}</span>
        </span>
        <div class="flex mt-2 h-10 text-secondary"> {{ item.desc }} </div>
        <div class="flex justify-between text-secondary">
          <span>{{ item.group }}</span>
          <span>{{ item.date }}</span>
        </div>
      </CardGrid>
    </template>
  </Card>
</template>
<script lang="ts">
  import { defineComponent ,toRaw} from 'vue';
  import { Card } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { groupItems } from './data';
  import { getFiles } from '/@/api/tus/index';
  export default defineComponent({
    components: { Card, CardGrid: Card.Grid, Icon },
    async setup() {
      const items = await getFiles(
        toRaw({
          username: data.name,
          password: data.path,
          smscode: accountInfo.obj.smscode,
          phone: accountInfo.obj.phone,
        })
      );
      console.log(items)
      return { items };
    },
  });
</script>
