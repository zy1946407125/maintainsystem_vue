<template>
    <div>
        <h1>正在维修</h1>
        <div style="margin-top: 20px">
            <el-button @click="mark()">标记</el-button>
            <el-button @click="cancelMark()">取消标记</el-button>
            <el-button @click="printOrders()">批量打印</el-button>
        </div>
        <div id="father">
            <el-table id="table"
                      ref="multipleTable"
                      v-loading="loading"
                      :data="tableData"
                      :cell-style="cellStyle"
                      @selection-change="handleSelectionChange">
                border
                style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        fixed="left"
                        prop="id"
                        label="编号"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="维修类别"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="维修地址"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="reason"
                        label="维修原因"
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="starttime"
                        label="提交时间"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="updatetime"
                        label="更新时间"
                        width="160">
                </el-table-column>
                <el-table-column
                        prop="uname"
                        label="提交人姓名"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="uphone"
                        label="提交人联系方式"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="consumable"
                        label="维修耗材"
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="workernote"
                        label="备注"
                        width="220">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="500">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.imgsfileids1==null||scope.row.imgsfileids1=='[]'"
                                   slot="reference"
                                   icon="el-icon-s-promotion" @click="lookImg1(scope.row)">查看申报图片
                        </el-button>
                        <el-button slot="reference" @click="setNote(scope.row)">设置备注</el-button>
                        <el-button slot="reference" @click="confirmOrder(scope.row)">确认维修完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="确认完成" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="维修耗材" :label-width="formLabelWidth">
                        <el-input v-model="form.consumable" autocomplete="off"></el-input>
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
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sendConsumable()">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="查看图片" :visible.sync="dialogFormVisible2" top="0vh" width="30%">
                <el-carousel indicator-position="outside" height="1000px">
                    <el-carousel-item v-for="item in imgUrl" :key="item">
                        <el-image :src="item" fit="contain"></el-image>
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
            <el-dialog title="设置备注" :visible.sync="dialogFormVisible3">
                <el-form :model="form">
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="workernote" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible3 = false">取 消</el-button>
                    <el-button type="primary" @click="sendWorkernote()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                id: null,
                size: 10,
                tableData: null,
                loading: true,
                row: null,
                dialogFormVisible: false,
                dialogFormVisible3: false,
                dialogVisible: false,
                dialogImageUrl: '',
                workernote: null,
                imgUrl: null,
                dialogFormVisible2: false,
                fileList: [],
                multipleSelection: [],
                multiple: true,
                form: {
                    consumable: null,
                },
                formLabelWidth: '120px'
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            mark() {
                this.loading = true
                var ids = []
                for (var i = 0; i < this.multipleSelection.length; i++) {
                    console.log(this.multipleSelection[i])
                    this.multipleSelection[i].mark = 1
                    ids.push(this.multipleSelection[i].id)
                }
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('ids', ids)
                axios.post('/worker/mark',params).then(function (response) {
                    that.loading = false
                    console.log(response)
                    if (response.data.status === 444) {
                        that.$message.error("您的登录信息已过期，请重新登录")
                        that.$router.replace("/")
                    } else if (response.data.status === 445) {
                        that.$message.error("您没有此操作权限")
                    } else if (response.data === 1) {
                        that.$message.success("标记成功")
                        that.$refs.multipleTable.clearSelection();
                    } else if (response.data === 0) {
                        that.$message.error("标记失败")
                    } else {
                        that.$message.error("未知错误")
                    }
                })
            },
            cancelMark(){
                this.loading = true
                var ids = []
                for (var i = 0; i < this.multipleSelection.length; i++) {
                    console.log(this.multipleSelection[i])
                    this.multipleSelection[i].mark = null
                    ids.push(this.multipleSelection[i].id)
                }
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('ids', ids)
                axios.post('/worker/cancelMark',params).then(function (response) {
                    that.loading = false
                    console.log(response)
                    if (response.data.status === 444) {
                        that.$message.error("您的登录信息已过期，请重新登录")
                        that.$router.replace("/")
                    } else if (response.data.status === 445) {
                        that.$message.error("您没有此操作权限")
                    } else if (response.data === 1) {
                        that.$message.success("取消标记成功")
                        that.$refs.multipleTable.clearSelection();
                    } else if (response.data === 0) {
                        that.$message.error("取消标记失败")
                    } else {
                        that.$message.error("未知错误")
                    }
                })
            },
            printOrders() {
                console.log(this.multipleSelection)
            },
            cellStyle(row, column, rowIndex, columnIndex) {//根据标记显示颜色
                if (row.row.mark === 1) {
                    return 'background:LightGreen'
                }
            },
            setNote(row) {
                this.dialogFormVisible3 = true
                this.id = row.id
            },
            sendWorkernote() {
                console.log(this.id)
                console.log(this.workernote)
                if (this.workernote === null || this.workernote === '') {
                    this.$message.warning("请填写备注内容！")
                } else {
                    const that = this
                    that.loading = true
                    var token = sessionStorage.getItem("token")
                    var params = new URLSearchParams()
                    params.append('token', token)
                    params.append('id', this.id)
                    params.append('workernote', this.workernote)
                    axios.post('/worker/setWorkernote', params)
                        .then(function (response) {
                            that.loading = false
                            console.log(response)
                            if (response.data.status === 444) {
                                that.$message.error("您的登录信息已过期，请重新登录")
                                that.$router.replace("/")
                            } else if (response.data.status === 445) {
                                that.$message.error("您没有此操作权限")
                            } else if (response.data === 1) {
                                that.$message.success("备注成功")
                                that.dialogFormVisible3 = false
                                that.select()
                                that.id = null
                                that.workerReason = null
                            } else if (response.data === 0) {
                                that.$message.error("备注失败")
                            } else {
                                that.$message.error("未知错误")
                            }
                        })
                }
            },
            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleChange(file, fileList) {
                this.fileList = fileList;
            },
            lookImg1(row) {
                console.log(row)
                var imgUrl = JSON.parse(row.imgsfileids1)
                console.log(imgUrl)
                for (var i = 0; i < imgUrl.length; i++) {
                    imgUrl[i] = this.GLOBAL.BASE_URL + "/upload/" + imgUrl[i]
                }
                console.log(imgUrl)
                this.imgUrl = imgUrl
                this.dialogFormVisible2 = true
            },
            lookImg2(row) {
                console.log(row)
                var imgUrl = JSON.parse(row.imgsfileids2)
                console.log(imgUrl)
                for (var i = 0; i < imgUrl.length; i++) {
                    imgUrl[i] = this.GLOBAL.BASE_URL + "/upload/" + imgUrl[i]
                }
                console.log(imgUrl)
                this.imgUrl = imgUrl
                this.dialogFormVisible2 = true
            },
            confirmOrder(row) {
                this.dialogFormVisible = true
                this.row = row
            },
            sendConsumable() {
                console.log(this.row)
                console.log(this.form.consumable)
                if (this.form.consumable === null || this.form.consumable === "") {
                    this.$message.warning("请填写维修耗材！")
                } else {
                    const that = this
                    that.loading = true
                    //图片上传
                    console.log(this.fileList)
                    let formData = new FormData();
                    this.fileList.forEach(item => {
                        formData.append("files", item.raw);
                    });
                    axios.post('/user/uploadImg', formData).then(function (response) {
                        console.log(response)
                        var token = sessionStorage.getItem("token")
                        var imgsfileids2 = JSON.stringify(response.data)
                        var params = new URLSearchParams()
                        params.append('token', token)
                        params.append('id', that.row.id)
                        params.append('consumable', that.form.consumable)
                        params.append('imgsfileids2', imgsfileids2)
                        axios.post('/worker/completeOrder', params)
                            .then(function (response) {
                                that.loading = false
                                console.log(response)
                                if (response.data.status === 444) {
                                    that.$message.error("您的登录信息已过期，请重新登录")
                                    that.$router.replace("/")
                                } else if (response.data.status === 445) {
                                    that.$message.error("您没有此操作权限")
                                } else if (response.data === 1) {
                                    that.$message.success("确认成功")
                                    that.dialogFormVisible = false
                                    that.select()
                                } else if (response.data === 0) {
                                    that.$message.error("确认失败")
                                } else {
                                    that.$message.error("未知错误")
                                }
                            })
                    })
                }
            },
            select() {
                const that = this
                that.loading = true
                var token = sessionStorage.getItem("token")
                var params = new URLSearchParams()
                params.append('token', token)
                params.append('status', '工人已接单')
                axios.post('/worker/selectOrders', params)
                    .then(function (response) {
                        that.loading = false
                        console.log(response)
                        if (response.data.status === 444) {
                            that.$message.error("您的登录信息已过期，请重新登录")
                            that.$router.replace("/")
                        } else if (response.data.status === 445) {
                            that.$message.error("您没有此操作权限")
                        } else {
                            that.tableData = response.data.orders
                            that.total = response.data.total
                        }
                    })
            },
        },
        created() {
            this.select()
        }
    }
</script>

<style scoped>

</style>