/*
 * @Author: Xyhao
 * @Date: 2026-04-18 11:39:36
 * @Description: 安徽爱喜网络科技有限公司
 */
define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'car/sign/index' + location.search,
                    add_url: 'car/sign/add',
                    edit_url: 'car/sign/edit',
                    del_url: 'car/sign/del',
                    multi_url: 'car/sign/multi',
                    import_url: 'car/sign/import',
                    table: 'car_sign',
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
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        // {field: 'carer_id', title: __('Carer_id')},
                        // {field: 'ddy_id', title: __('Ddy_id')},
                        {field: 'user.nickname', title: __('User.nickname'), operate: 'LIKE'},
                        {field: 'user.carnums', title: __('User.carnums'), operate: 'LIKE', table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        {field: 'ddy.nickname', title: __('Ddy.nickname'), operate: 'LIKE', table: table, class: 'autocontent', formatter: Table.api.formatter.content},                        
                        {field: 'start_city', title: __('Start_city'), operate: 'LIKE'},
                        {field: 'end_city', title: __('End_city'), operate: 'LIKE'},
                        {field: 'xiehuo_images', title: __('Xiehuo_images'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'huizhou_images', title: __('Huizhou_images'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.images},
                        {field: 'money', title: __('Money'), operate:'BETWEEN'},
                        {field: 'content', title: __('Content'), operate: 'LIKE', table: table, class: 'autocontent', formatter: Table.api.formatter.content},
                        // {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'status', title: __('Status'), searchList: {"normal":__('Normal'),"hidden":__('Hidden')}, formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ],
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
