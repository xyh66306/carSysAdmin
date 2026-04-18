/*
 * @Author: Xyhao
 * @Date: 2026-04-18 14:24:04
 * @Description: 安徽爱喜网络科技有限公司
 */
define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'car/baoxiao/index' + location.search,
                    add_url: 'car/baoxiao/add',
                    edit_url: 'car/baoxiao/edit',
                    del_url: 'car/baoxiao/del',
                    multi_url: 'car/baoxiao/multi',
                    import_url: 'car/baoxiao/import',
                    table: 'car_baoxiao',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                fixedColumns: true,
                fixedRightNumber: 1,
                //快捷搜索,这里可在控制器定义快捷搜索的字段
                search: true,
                //启用普通表单搜索
                commonSearch: true,
                //显示导出按钮
                showExport: true,    
                searchFormVisible: true,  
                //导出类型
                exportDataType: "all", //共有basic, all, selected三种值 basic当前页 all全部 selected仅选中
                //导出下拉列表选项
                exportTypes: ['xml', 'csv', 'doc', 'excel'],                        
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        // {field: 'user_id', title: __('User_id')},
                        {field: 'user.nickname', title: __('User.nickname'), operate: 'LIKE'},
                        {field: 'type', title: __('Type'), searchList: {"1":__('Type 1'),"2":__('Type 2'),"3":__('Type 3'),"4":__('Type 4')}, formatter: Table.api.formatter.normal},
                        {field: 'money', title: __('Money'), operate:'BETWEEN'},
                        {field: 'bx_images', title: __('Bx_images'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'pay_images', title: __('Pay_images'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'beizhu', title: __('Beizhu'), operate: 'LIKE', table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'status', title: __('Status'), searchList: {"1":__('Status 1'),"2":__('Status 2'),"3":__('Status 3')}, formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
