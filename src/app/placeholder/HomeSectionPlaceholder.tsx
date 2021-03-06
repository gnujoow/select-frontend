import * as React from 'react';

import { ChartBookListSkeleton, HotReleaseBookListSkeleton, InlineHorizontalBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { CollectionType } from 'app/services/home';

interface HomeSectionPlaceholderProps {
  type?: CollectionType;
}

export const HomeSectionPlaceholder: React.SFC<HomeSectionPlaceholderProps> = (props) => {
  if (props.type && props.type === CollectionType.CHART) {
    return (
      <div className="HomeSection_Skeleton HomeSection_Chart_Skeleton">
        <div className="HomeSection_Header Skeleton" />
        <ChartBookListSkeleton />
      </div>
    );
  } else if (props.type && props.type === CollectionType.HOT_RELEASE) {
    return (
      <div className="HomeSection_HotRelease_Skeleton HomeSection_HotRelease">
        <div className="HomeSection_HotRelease_Contents">
          <div className="HomeSection_HotRelease_Title_Skeleton Skeleton" />
          <HotReleaseBookListSkeleton />
        </div>
      </div>
    );
  }
  return (
    <div className="HomeSection_Skeleton">
      <div className="HomeSection_Header Skeleton" />
      <InlineHorizontalBookListSkeleton />
    </div>
  );
};
