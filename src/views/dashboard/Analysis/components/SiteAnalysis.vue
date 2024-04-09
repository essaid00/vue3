<template>
  <Card :tab-list="tabListTitle" v-bind="$attrs" :active-tab-key="activeKey" @tabChange="onTabChange">
    <p v-if="activeKey === 'tab1'">

      <Dashboard :uppy="uppy"  />
 
    </p>
    <p v-if="activeKey === 'tab2'">
      <div>
    <input type="file" @change="handleFileChange" />
    <button @click="uploadFile">Upload</button>
  </div>
    </p>
  </Card>
</template>
<script lang="ts" setup>
  import { ref,onMounted } from 'vue';
  import { Card } from 'ant-design-vue';
  import * as tus from "tus-js-client";
  import { Dashboard,DashboardModal,ProgressBar } from '@uppy/vue';
	import Uppy from '@uppy/core';
	import Webcam from '@uppy/webcam';
  import { defHttp } from '/@/utils/http/axios';
	import fr_FR from  '@uppy/locales/lib/fr_FR'
	// Don't forget the CSS: core and UI components + plugins you are using
	import '@uppy/core/dist/style.css';
	import '@uppy/dashboard/dist/style.css';
	import '@uppy/webcam/dist/style.css';
  import { getToken } from '/@/utils/auth';

  import Tus from '@uppy/tus';
  const token =ref('')
  onMounted(async () => {
  	 token.value = await getToken();
  });

  
	const uppy = new Uppy({ id: 'Uppy', autoProceed: false, debug: true,locale:fr_FR }).use(Tus, { headers: {Authorization:  token.value},
	endpoint: 'http://localhost:8080/jeecg-boot/upload/api/upload', 
   withCredentials:true,
	async onBeforeRequest(req) {	
		req.setHeader('Authorization', `${token.value}`);
    req.setHeader('X-Access-Token', `${token.value}`);
    req.setHeader('Access-Control-Allow-Origin', '*');
    req.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    req.setHeader('Access-Control-Allow-Credentials', 'true');
    
	},
	onShouldRetry(err, retryAttempt, options, next) {
		if (err?.originalResponse?.getStatus() === 401) {
			return true;
		}
		return next(err);
	},
	async onAfterResponse(req, res) {
		if (res.getStatus() === 401) {			
			console.log( 'refreshAuthToken')		
		}
	},
});  
uppy.on('upload-success', async(file, response) => {
    // Assuming the server responds with the fileId or unique identifier of the uploaded file
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkk")
    console.log(file)

    const fileId = response.body.fileId;
    const getViewFileDomain = () => defHttp.get({ url: `/upload/api/download2/${file?.name}` });
    
  const  onlinePreviewDomain = await getViewFileDomain();
    // Make a request to your server to get the download URL for the uploaded file
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkk")
    
    console.log(onlinePreviewDomain)
});
const open=ref(true)
const handleClose= () =>{ open.value = false }
const activeKey = ref('tab1');

  const tabListTitle = [
    {
      key: 'tab1',
      tab: '流量趋势',
    },
    {
      key: 'tab2',
      tab: '访问量',
    },
  ];

  function onTabChange(key) {
    activeKey.value = key;
  }
  const fileInput = ref(null);
    const uploadUrl = 'http://localhost:8080/jeecg-boot/upload/api/upload'; // Your Tus server endpoint

    const handleFileChange = (event) => {
      fileInput.value = event.target.files[0];
    };

    const uploadFile = async () => {
      if (!fileInput.value) {
        alert('Please select a file.');
        return;
      }

      const file = fileInput.value;
      const upload = new tus.Upload(file, {
        endpoint: uploadUrl,
        headers:{'Authorization':  token.value,'X-Access-Token': `${token.value}`},
        onError: (error) => {
          console.error('Upload error:', error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          console.log(`Progress: ${bytesUploaded}/${bytesTotal} bytes`);
        },
        onSuccess: () => {
          console.log('Upload complete!');
        },
      });

      upload.start();
    };
</script>
