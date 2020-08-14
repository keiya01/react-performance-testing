import { perf as origPerf } from '../perf';
import { DefaultPerfToolsField } from '../types';
import { getDisplayName } from '../getDisplayName';
import { isForwardRefComponent } from '../utils/isForwardRefComponent';

export const perf = <T = DefaultPerfToolsField>(React: any) => {
  // Copied from https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/native/index.js#L24
  // We don't need wrap these components.
  const aliases = `ActivityIndicator ActivityIndicatorIOS AnimatedComponent AppContainer ART Button DatePickerIOS DrawerLayoutAndroid
    Image ImageBackground ImageEditor ImageStore KeyboardAvoidingView ListView MapView Modal NavigatorIOS
    Picker PickerIOS ProgressBarAndroid ProgressViewIOS PressabilityDebugView ScrollView SegmentedControlIOS Slider
    SliderIOS SnapshotViewIOS Switch RecyclerViewBackedScrollView RefreshControl SafeAreaView StatusBar
    SwipeableListView SwitchAndroid SwitchIOS TabBarIOS Text TextInput ToastAndroid ToolbarAndroid
    Touchable TouchableHighlight TouchableNativeFeedback TouchableOpacity TouchableWithoutFeedback
    View ViewPagerAndroid WebView YellowBox YellowBoxContainer YellowBoxList FlatList SectionList 
    VirtualizedList Pressable`
    .split(/\s+/m)
    .map((alias) => alias);

  const origCreateElement = React.createElement;

  const tools = origPerf<T>(React);

  const patchedCreateElement = React.createElement;

  React.createElement = function (type: React.ElementType, ...rest: any) {
    if (
      aliases.includes(getDisplayName(type)) ||
      (typeof type !== 'string' && isForwardRefComponent(type as any))
    ) {
      return origCreateElement.apply(React, [type, ...rest]);
    }

    return patchedCreateElement.apply(React, [type, ...rest]);
  };

  return tools;
};
