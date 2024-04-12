<template>
  <Card title="项目" v-bind="$attrs">
    <template #extra>
      <a-button type="link" size="small">said</a-button>
    </template>

    <template v-for="item in items" :key="item">
      <CardGrid class="!md:w-1/3 !w-full" @click="openModal(item.path)">
        <span class="flex">
          <Icon :icon="item.key" :color="item.key" size="30" />
          <span class="text-lg ml-4">{{ item.name }}</span>
        </span>
        <div class="flex mt-2 h-10 text-secondary"> {{ item.path }} </div>
        <div class="flex justify-between text-secondary">
          <span>{{ item.type }}</span>
          <span>{{ item.lastModifiedDateTime }}</span>
          <span>{{ item.size }}</span>
        </div>
      </CardGrid>
    </template>
  </Card>
</template>
<script lang="ts">
  import { defineComponent, toRaw, onMounted, ref } from 'vue';
  import { Card } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';

  import { getFiles, getDownloadFileZip } from '/@/api/tus/index';
  export default defineComponent({
    components: { Card, CardGrid: Card.Grid, Icon },
    setup() {
      const items = ref([]);
      onMounted(async () => {
        items.value = await getFiles({ name: 'aff', path: 'C:\\upload_dir\\APPLICATION_APPOINT\\' }).then((data) => {
          return data.fileList;
        });
        console.log(items);
      });
      async function openModal(path) {
        await getDownloadFileZip({ name: 'aff', paths: [path] })
      }

      return { items, openModal };
    },
  });
</script>
