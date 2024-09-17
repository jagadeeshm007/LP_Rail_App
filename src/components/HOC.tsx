import React from 'react';
import { TouchableOpacity, Pressable } from 'react-native';

const withLoadingDisabled = (Component: React.ComponentType<any>) => ({ loading, ...props }: { loading: boolean, [key: string]: any }) => (
  <Component {...props} disabled={loading} />
);

export const TouchableOpacityWithLoading = withLoadingDisabled(TouchableOpacity);
export const PressableWithLoading = withLoadingDisabled(Pressable);