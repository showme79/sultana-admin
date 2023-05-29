import { Segment } from 'consts';
import services from 'services';
import { createActions } from 'utils/store';

import { getFilter, getRange, getSort, getTags } from './selectors';

const actions = createActions(
  {
    createTag: (userId) => ({ userId }),

    resetTag: null,

    loadTag: [
      (tagId) => (dispatch) => {
        dispatch(actions.resetTag());

        return services
          .loadTag({ tagId })
          .then((response) => dispatch(actions.loadTagSuccess(response, response.data)));
      },
    ],
    loadTagSuccess: (response, data) => ({ response, data }),

    loadTags: [
      ({ filter, sort, range }) =>
        (dispatch) => {
          const filterParams = {
            'name~like': `%${filter.name || ''}%`,
            'segments~like': filter.segment !== Segment.ALL ? `%${filter.segment}%` : undefined,
            status: filter.status !== 'ALL' ? filter.status : undefined,
          };

          return services
            .loadTags({ filter: filterParams, sort, range })
            .then((response) => dispatch(actions.loadTagsSuccess(response, response.data, { filter, sort, range })));
        },
    ],
    loadTagsSuccess: (response, data, query) => ({ response, data, query }),

    saveTag: [
      (tag) => (dispatch) => {
        const { id: tagId } = tag;
        return services[tagId ? 'updateTag' : 'createTag']({ tagId, tag }).then((response) =>
          dispatch(actions.saveTagSuccess(response, response.data)),
        );
      },
    ],
    saveTagSuccess: (response, data) => ({ response, data }),

    deleteTags: [
      (id) => (dispatch, getState) =>
        services.deleteTags({ id }).then((response) => {
          const { data: { result = [] } = {} } = response || {};
          const state = getState();
          const [tags, sort, rangeOld, filter] = [getTags(state), getSort(state), getRange(state), getFilter(state)];

          // update page when all items are deleted
          const range =
            tags.length - result.length <= 0
              ? {
                  offset: Math.max(0, rangeOld.offset - rangeOld.limit),
                  limit: rangeOld.limit,
                }
              : rangeOld;

          dispatch(actions.loadTags({ filter, sort, range }));
          return response;
        }),
    ],
  },
  'tags',
);

export default actions;
