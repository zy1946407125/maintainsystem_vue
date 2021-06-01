<template>
    <div v-loading="loading">
        <h1>新建工单</h1>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="维修类型" prop="type">
                <el-select v-model="ruleForm.type" placeholder="请选择维修类型">
                    <el-option v-for="(item,index) in optionsType"
                               :key="index"
                               :value="item.value"
                               :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="维修原因" prop="reason">
                <el-input v-model="ruleForm.reason" autocomplete="off" style="width: 800px"></el-input>
            </el-form-item>
            <el-form-item label="维修地址" prop="address">
                <el-input v-model="ruleForm.address" autocomplete="off" style="width: 800px"></el-input>
            </el-form-item>
        </el-form>
        <el-upload
                action="aaaaaaa"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :auto-upload="false"
                :multiple="multiple"
                :file-list="fileList">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button type="primary" @click="submitForm('ruleForm')">提交工单</el-button>
    </div>
</template>

<script>
    export default {
        name: "AddOrder",
        data() {
            return {
                fileList: [],
                loading: true,
                optionsType: [],
                dialogImageUrl: '',
                dialogVisible: false,
                multiple: true,
                ruleForm: {
                    type: null,
                    reason: null,
                    address: null,
                },
                rules: {
                    type: [
                        {required: true, message: '请选择维修类型', trigger: 'change'}
                    ],
                    reason: [
                        {required: true, message: '请输入维修原因！', trigger: 'blur'},
                    ],
                    address: [
                        {required: true, message: '请输入维修地址！', trigger: 'blur'},
                    ]
                },
            }
        },
        methods: {
            submitUpload() {
                console.log(this.fileList)
                let formData = new FormData();
                this.fileList.forEach(item => {
                    formData.append("files", item.raw);
                });

                axios.post('/user/uploadImg', formData).then(function (response) {
                    console.log(response)
                })
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleChange(file, fileList) {
                this.fileList = fileList;
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let that = this
                        that.loading = true
                        //图片上传
                        console.log(this.fileList)
                        let formData = new FormData();
                        this.fileList.forEach(item => {
                            formData.append("files", item.raw);
                        });
                        axios.post('/user/uploadImg', formData).then(function (response) {
                            console.log(response)
                            let params = new URLSearchParams()
                            let type = that.ruleForm.type
                            let reason = that.ruleForm.reason
                            let address = that.ruleForm.address
                            // let imgsfileids1 = response.data
                            let imgsfileids1 = JSON.stringify(response.data)
                            console.log(imgsfileids1)
                            const token = sessionStorage.getItem("token");
                            params.append('token', token)
                            params.append('type', type)
                            params.append('reason', reason)
                            params.append('address', address)
                            params.append('imgsfileids1', imgsfileids1)
                            axios.post('/user/addOrder', params).then(function (response) {
                                that.loading = false
                                console.log(response)
                                that.loading = false
                                if (response.data.status === 444) {
                                    that.$message.error("您的登录信息已过期，请重新登录")
                                    that.$router.replace("/")
                                } else if (response.data.status === 445) {
                                    that.$message.error("您没有此操作权限")
                                } else {
                                    that.$message.success("工单提交成功")
                                    that.ruleForm.address = null
                                    that.ruleForm.reason = null
                                }
                            })
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

        },
        created() {
            const token = sessionStorage.getItem("token");
            const that = this;
            that.loading = true
            let params = new URLSearchParams();
            params.append('token', token)
            axios.post("/user/selectWorkType", params).then(function (response) {
                that.loading = false
                if (response.data.status === 444) {
                    that.$message.error("您的登录信息已过期，请重新登录")
                    that.$router.replace("/")
                } else if (response.data.status === 445) {
                    that.$message.error("您没有此操作权限")
                } else {
                    for (let i = 0; i < response.data.length; i++) {
                        let tmp = {
                            value: response.data[i].type,
                            label: response.data[i].type
                        }
                        that.optionsType.push(tmp)
                    }
                }
            })
        }
    }
</script>

<style scoped>

</style>