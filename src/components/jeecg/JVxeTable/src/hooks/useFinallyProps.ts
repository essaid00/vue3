import { unref, computed } from 'vue';
import { merge } from 'lodash-es';
import { isArray } from '/@/utils/is';
import { useAttrs } from '/@/hooks/core/useAttrs';
import { useKeyboardEdit } from '../hooks/useKeyboardEdit';
import { JVxeDataProps, JVxeTableMethods, JVxeTableProps } from '../types';

export function useFinallyProps(props: JVxeTableProps, data: JVxeDataProps, methods: JVxeTableMethods) {
  const attrs = useAttrs();
  // vxe 键盘操作配置
  const { keyboardEditConfig } = useKeyboardEdit(props);
  // vxe 最终 editRules
  const vxeEditRules = computed(() => merge({}, props.editRules, data.innerEditRules));
  // vxe 最终 events
  const vxeEvents = computed(() => {
    let listeners = { ...unref(attrs) };
    let events = {
      onScroll: methods.handleVxeScroll,
      onCellClick: methods.handleCellClick,
      onEditClosed: methods.handleEditClosed,
      onEditActived: methods.handleEditActived,
      onRadioChange: methods.handleVxeRadioChange,
      onCheckboxAll: methods.handleVxeCheckboxAll,
      onCheckboxChange: methods.handleVxeCheckboxChange,
    };
    // 用户传递的事件，进行合并操作
    Object.keys(listeners).forEach((key) => {
      let listen = listeners[key];
      if (events.hasOwnProperty(key)) {
        if (isArray(listen)) {
          listen.push(events[key]);
        } else {
          listen = [events[key], listen];
        }
      }
      events[key] = listen;
    });
    return events;
  });
  // vxe 最终 props
  const vxeProps = computed(() => {
    return merge(
      {},
      data.defaultVxeProps,
      {
        showFooter: data.statistics.has,
      },
      unref(attrs),
      {
        ref: 'gridRef',
        size: props.size,
        loading: false,
        disabled: props.disabled,
        columns: unref(data.vxeColumns),
        editRules: unref(vxeEditRules),
        height: props.height === 'auto' ? null : props.height,
        maxHeight: props.maxHeight,
        // update-begin--author:liaozhiyang---date:20231013---for：【QQYUN-5133】JVxeTable 行编辑升级
        scrollY: props.scrollY,
        scrollX: props.scrollX,
        // update-end--author:liaozhiyang---date:20231013---for：【QQYUN-5133】JVxeTable 行编辑升级
        border: props.bordered,
        footerMethod: methods.handleFooterMethod,
        // 展开行配置
        expandConfig: {
          toggleMethod: methods.handleExpandToggleMethod,
        },
        // 可编辑配置
        editConfig: {
          // update-begin--author:liaozhiyang---date:20231013---for：【QQYUN-5133】JVxeTable 行编辑升级
          //activeMethod: methods.handleActiveMethod,
          beforeEditMethod: methods.handleActiveMethod,
          // update-end--author:liaozhiyang---date:20231013---for：【QQYUN-5133】JVxeTable 行编辑升级
        },
        radioConfig: {
          checkMethod: methods.handleCheckMethod,
        },
        checkboxConfig: {
          checkMethod: methods.handleCheckMethod,
        },
      },
      unref(vxeEvents),
      unref(keyboardEditConfig)
    );
  });
  return {
    vxeProps,
    prefixCls: data.prefixCls,
  };
}
