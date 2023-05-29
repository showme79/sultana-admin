import services from 'services';
import { createActions } from 'utils/store';

import { getFilter, getMediaList, getRange, getSort } from './selectors';

const actions = createActions(
  {
    createMedia: (userId) => ({ userId }),

    resetMedia: null,

    loadMedia: [
      (mediaId) => (dispatch) => {
        dispatch(actions.resetMedia());

        return services
          .loadMedia({ mediaId })
          .then((response) => dispatch(actions.loadMediaSuccess(response, response.data)));
      },
    ],
    loadMediaSuccess: (response, data) => ({ response, data }),

    loadMediaList: [
      ({ filter: { type } = {}, sort, range, search = '' }) =>
        (dispatch) => {
          const filter = {
            type: type !== 'ALL' ? type : undefined,
          };

          return services
            .loadMediaList({
              filter,
              sort,
              range,
              search,
            })
            .then((response) =>
              dispatch(
                actions.loadMediaListSuccess(response, response.data, {
                  filter,
                  sort,
                  range,
                  search,
                }),
              ),
            );
        },
    ],
    loadMediaListSuccess: (response, data, query) => ({ response, data, query }),

    saveMedia: [
      (media) => (dispatch) => {
        const { id: mediaId } = media;

        /*
    return axios({
      method: 'post',
      url: 'http://localhost:3000/api/media',
      data: media,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then(response => dispatch(actions.saveMediaSuccess(response, response.data)));
    */

        return services[mediaId ? 'updateMedia' : 'createMedia']({ mediaId, media }).then((response) =>
          dispatch(actions.saveMediaSuccess(response, response.data)),
        );
      },
    ],
    saveMediaSuccess: (response, data) => ({ response, data }),

    deleteMultipleMedia: [
      (id) => (dispatch, getState) =>
        services.deleteMultipleMedia({ id }).then((response) => {
          const { data: { result = [] } = {} } = response || {};
          const state = getState();
          const [medias, sort, rangeOld, filter] = [
            getMediaList(state),
            getSort(state),
            getRange(state),
            getFilter(state),
          ];

          // update page when all items are deleted
          const range =
            medias.length - result.length <= 0
              ? {
                  offset: Math.max(0, rangeOld.offset - rangeOld.limit),
                  limit: rangeOld.limit,
                }
              : rangeOld;

          dispatch(actions.loadMediaList({ filter, sort, range }));
          return response;
        }),
    ],
  },
  'media',
);

export default actions;
