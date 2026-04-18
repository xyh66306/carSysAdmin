<?php

namespace app\admin\model\car;

use think\Model;


class Sign extends Model
{

    

    

    // 表名
    protected $name = 'car_sign';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [
        'status_text'
    ];
    

    
    public function getStatusList()
    {
        return ['normal' => __('Normal'), 'hidden' => __('Hidden')];
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ?: ($data['status'] ?? '');
        $list = $this->getStatusList();
        return $list[$value] ?? '';
    }




    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'carer_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function ddy()
    {
        return $this->belongsTo('app\admin\model\user\Ddy', 'ddy_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
