import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Switch as MuiSwitch,
  TextField as MuiTextField,
  withStyles,
} from '@material-ui/core';
import { ImageCrop, ImageCropRatio } from '@showme79/sultana-common';
import CustomEditor from 'ckeditor5-custom-build';
import clsx from 'clsx';
import { Field, Formik } from 'formik';
import { CheckboxWithLabel, Switch, TextField } from 'formik-material-ui';
import { find, get, isArray, isString, kebabCase, map, set } from 'lodash-es';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Action,
  PostContentMode,
  PostStatus,
  PriorityMode,
  Segment,
  TagStatus,
  ViewMode,
  fieldProps as defaultFieldProps,
} from 'consts';
import { PostRightsPropType } from 'consts/prop-types';
import { AlarmOnIcon, DoneAllIcon, DoneIcon, RemoveRedEyeIcon, SaveAltIcon, SaveIcon } from 'icons';
import { PostContentModeText, PostStatusText, PriorityModeText, ViewModeText } from 'lang/hu';
import services from 'services';
import { AppSelectors } from 'state';
import { fromJson, getMediaUrl, getPreviewUrl, getSegmentFilterItems, mapApiErrorsToFormErrors } from 'utils';
import {
  DateTimePicker,
  ImagePicker,
  Label,
  Select,
  SelectCategoryChip,
  SelectTagChip,
  SimpleSelect,
  SliderField,
} from 'view/base';
import { ImageSelectField, ModalEditor } from 'view/components';

import styles from './PostEditor.styles';

const viewModes = [ViewMode.MOBILE, /* ViewMode.TABLET, */ ViewMode.DESKTOP];
const MAX_ATTR_DESCRIPTION_LENGTH = 180;

const segmentItems = getSegmentFilterItems({ all: false, special: true });

const priorityModeItems = map(PriorityMode, (priorityMode) => ({
  id: priorityMode,
  name: PriorityModeText[priorityMode],
}));

const croppers = [
  {
    id: ImageCrop.SQUARE,
    text: 'Négyzet (1:1)',
    crop: {
      aspect: ImageCropRatio[ImageCrop.SQUARE],
    },
  },
  {
    id: ImageCrop.WIDE,
    text: 'Széles (2:1)',
    crop: {
      aspect: ImageCropRatio[ImageCrop.WIDE],
    },
  },
  {
    id: ImageCrop.NARROW,
    text: 'Keskeny (3:2)',
    crop: {
      aspect: ImageCropRatio[ImageCrop.NARROW],
    },
  },
];

const croppersSecondary = croppers;

const ckEditorConfig = {
  image: {
    resizeOptions: [
      {
        name: 'resizeImage:original',
        value: null,
        label: 'Eredeti méret',
        icon: 'original',
      },
      {
        name: 'resizeImage:33',
        value: '33',
        label: '1/3 szélesség',
        icon: 'small',
      },
      {
        name: 'resizeImage:50',
        value: '50',
        label: 'Fél szélesség',
        icon: 'medium',
      },
      {
        name: 'resizeImage:100',
        value: '100',
        label: 'Teljes szélesség',
        icon: 'large',
      },
    ],
    toolbar: [
      'resizeImage:original',
      'resizeImage:33',
      'resizeImage:50',
      'resizeImage:100',
      'imageStyle:inline',
      'imageStyle:alignLeft',
      'imageStyle:alignRight',
      'imageStyle:alignCenter',
      'imageStyle:alignBlockLeft',
      'imageStyle:alignBlockRight',
      'toggleImageCaption',
      'imageTextAlternative',
    ],
  },
};

const calcInitialValues = (
  {
    title,
    lead,
    content,
    contentMode,
    redirectUrl,
    image,
    imageSecondary,
    priority,
    priorityMode,
    segment,
    categoryPriority,
    source,
    approveOn,
    approvedAt,
    skipSearch,
    pollId,
    attributes,
    ...post
  },
  postsMaxPriority,
) => {
  const imageStyles = fromJson(post.imageStyles);
  const {
    script = '',
    css = '',
    description = '',
    photo = '',
    illustration = '',
    relatedPostsOnlyFromFirstTag = false,
  } = attributes || {};
  return {
    ...post,
    title: title || '',
    image: {
      ...image,
      croppers: imageStyles?.primary || imageStyles || undefined,
    },
    imageSecondary: {
      ...imageSecondary,
      croppers: imageStyles?.secondary || undefined,
    },
    contentMode: PostContentMode[contentMode] ? contentMode : PostContentMode.WYSIWYG,
    priority: Math.max(0, Math.min(postsMaxPriority, priority)) || 0,
    priorityMode: PriorityMode[priorityMode] || PriorityMode.REORDER,
    categoryPriority: !!categoryPriority,
    lead: lead || '',
    approveOn: DateTime.fromISO(approveOn || new DateTime(Date.now())),
    approvedAt: DateTime.fromISO(approvedAt || new DateTime(Date.now())),
    source: source || '',
    segment: Segment[segment] || Segment.FAMILY,
    redirectUrl: redirectUrl || '',
    skipSearch: !!skipSearch || false,
    slugEditable: !!title && post.slug !== kebabCase(title),
    attributes: {
      script,
      css,
      description,
      photo,
      illustration,
      relatedPostsOnlyFromFirstTag,
    },
    pollId: pollId || 0,
  };
};

const validate = (values) => {
  const errors = {};

  if (get(values, 'slugEditable') && !get(values, 'slug')) {
    set(errors, 'slug', 'Ezt a mezőt kötelezeő kitölteni!');
  }
  if (!get(values, 'title')) {
    set(errors, 'title', 'Ezt a mezőt kötelezeő kitölteni!');
  }
  if (!get(values, 'approveOn')) {
    set(errors, 'approveOn', 'Kötelező érték (pl.: 2019.12.27 13:45)!');
  }
  if (!get(values, 'attributes.description')) {
    set(errors, 'attributes.description', 'Ezt a mezőt kötelezeő kitölteni!');
  }
  if (get(values, 'attributes.description')?.length > MAX_ATTR_DESCRIPTION_LENGTH) {
    set(
      errors,
      'attributes.description',
      `A közösségi média leírás túl hosszú (max ${MAX_ATTR_DESCRIPTION_LENGTH} karakter)`,
    );
  }
  return errors;
};

const hasError = (errors) => !!find(errors, (error) => (isArray(error) ? error.length : true));

const getOptionValue = (option) => option.id;

const getOptionLabel = (option) => option.name;

const getGalleryValue = ({ id }) => id;

const getGalleryLabel = ({ title }) => title;

const noOptionsMessage = (text) => (/* {inputValue} */) => text;

const getNewTagData = (inputValue, optionLabel) => ({
  id: `new-${inputValue}`,
  name: optionLabel,
  status: TagStatus.NOT_APPROVED,
});

const compareTag = (inputValue = '', option = undefined) => {
  const candidate = String(inputValue).toLowerCase();
  const optionValue = String(option.id).toLowerCase();
  const optionLabel = String(option.name).toLowerCase();
  return optionValue === candidate || optionLabel === candidate;
};

const loadTags = (inputValue) => {
  const filter = { 'name~like': `%${inputValue || ''}%` };
  return services.loadTags({ filter }, { progress: false }).then(({ data: { result = [] } = {} } = {}) => result);
};

const isValidNewTag = (inputValue, selectValue, selectOptions) =>
  inputValue &&
  inputValue.length >= 3 &&
  !selectValue.some((option) => compareTag(inputValue, option)) &&
  !selectOptions.some((option) => compareTag(inputValue, option));

const onRedirectClick = (form) => (/* event */) => {
  if (form.values.redirectUrl) {
    form.setFieldValue('redirectUrl', '');
  } else {
    form.setFieldValue('redirectUrl', 'http://www.csalad.hu'); // TODO: get from preferences
  }
};

class PostEditor extends Component {
  submitState = undefined;

  editorRef = null;

  ckEditorRef = null;

  constructor(props) {
    super(props);

    this.ckEditorRef = React.createRef();
    this.editorRef = React.createRef();

    const {
      post,
      post: { content },
    } = props;

    this.state = {
      viewMode: viewModes[0],
      polls: undefined,
      categories: undefined,
      galleries: undefined,
      createdTags: [],
      originalContent: content || '',
      content: content || '',
    };

    this.initialValues = calcInitialValues(post);
  }

  componentDidMount() {
    services.loadCategories(null, { progress: false }).then(({ data: { result = [] } = {} } = {}) => {
      this.setState({ categories: result }); // .map(({ id: value, name: label }) => ({ value, label })) });
    });

    services.loadPolls(null, { progress: false }).then(({ data: { result = [] } = {} } = {}) => {
      this.setState({
        polls: [
          {
            id: 0,
            name: 'Nincs szavazás',
          },
          ...result,
        ],
      });
    });

    services.loadGalleries(null, { progress: false }).then(({ data: { result = [] } = {} } = {}) => {
      this.setState({ galleries: result }); // .map(({ id: value, name: label }) => ({ value, label })) });
    });

    this.editorRef.current.parentNode.addEventListener('scroll', this.onEditorScroll);
  }

  onEditorScroll = () => {
    const scrollTop = this.editorRef.current.parentNode.scrollTop - 8;
    const editorTop = this.ckEditorRef.current?.ui?.view?.element?.offsetTop;
    const toolbar = this.ckEditorRef.current?.ui?.view?.toolbar?.element;
    // in case of HTML mode
    if (!toolbar) {
      return;
    }

    if (editorTop > scrollTop) {
      toolbar.style.position = '';
      toolbar.parentNode.style.paddingTop = '';
    } else {
      toolbar.style.position = 'absolute';
      toolbar.style.top = `${scrollTop - editorTop}px`;
    }
  };

  onDialogClose = (event) => {
    const { onClose } = this.props;
    return onClose?.(event);
  };

  onFormSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    const { submitAction, onClose, post } = this.props;
    const { action, event } = this.submitState;
    const { id: actionId } = action;
    this.submitState = null;

    const {
      gallery,
      status,
      priority,
      lockedBy,
      lockedAt,
      image,
      imageSecondary,
      tags = [],
      categoryPriority,
      slugEditable,
      slug,
      pollId,
      contentMode,
      ...saveValues
    } = values;
    const unlock = [Action.SAVE_AND_READY, Action.SAVE_AND_APPROVE].includes(actionId);
    const content = this.getContent(values);
    const closingAction = [Action.SAVE, Action.SAVE_AND_READY, Action.SAVE_AND_APPROVE].includes(actionId);

    submitAction(
      {
        ...saveValues,
        content,
        contentMode,
        galleryId: gallery?.id || null,
        imageMediaId: image?.id || null,
        imageSecondaryMediaId: imageSecondary?.id || null,
        imageStyles:
          (image?.croppers || imageSecondary?.croppers) &&
          JSON.stringify({
            primary: image?.croppers,
            secondary: imageSecondary?.croppers,
          }),
        tags: tags.map((tag) => (isString(tag.id) && tag.id.startsWith('new-') ? { ...tag, id: undefined } : tag)),
        status:
          (actionId === Action.SAVE_AND_READY ? PostStatus.READY : false) ||
          (actionId === Action.SAVE_AND_APPROVE && status !== PostStatus.APPROVE_ON ? PostStatus.APPROVED : false) ||
          status,
        priority: Math.max(0, Math.min(priority, this.getPostMaxPriority())),
        categoryPriority: categoryPriority ? 1 : null,
        slug: slugEditable ? slug : kebabCase(saveValues.title),
        lockedBy: unlock ? null : lockedBy,
        lockedAt: unlock ? null : lockedAt,
        pollId: pollId || null,
      },
      post,
      {
        action,
        unlock: closingAction,
      },
    )
      .then((/* { data: { result: savedPost } = undefined } = {} */) => {
        this.initialValues = this.calcInitialValues(post, this.getPostMaxPriority());
        resetForm({ values: this.initialValues });
        this.setState({ originalContent: content });

        return onClose && closingAction && onClose(event);
      })
      .catch(({ response: { data = null } = {} } = {}) => {
        setSubmitting(false);
        setErrors(mapApiErrorsToFormErrors(data));
      });
  };

  onActionClick = (action, { handleSubmit }, event) => {
    const { id: actionId } = action;

    if (actionId === Action.PREVIEW) {
      const { post } = this.props;
      window.open(getPreviewUrl(post), 'previewWindow', 'menubar=0,toolbar=0,width=1280,height=f');
      return null;
    }

    if ([Action.SAVE, Action.SAVE_AND_CONTINUE, Action.SAVE_AND_READY, Action.SAVE_AND_APPROVE].includes(actionId)) {
      this.submitState = { event, action };
      return handleSubmit();
    }
    return null;
  };

  renderCategoriesSelect = ({ field }) => {
    const { rights } = this.props;
    const { categories } = this.state;

    return (
      <Select
        {...field}
        formik
        isMulti
        label="Kategóriák"
        placeholder="Válassz kategóriákat..."
        helperText={
          <>
            Itt lehet megadni, hogy az bejegyzés melyik rovat oldalakon jelenjen meg. Az első kategória kiemelt szerepet
            kap, mert mindig az jelenik meg a bejegyzés oldalon, mint a bejegyzés kategóriája.
            <br />A <i>Kategória kiemelés</i> kapcsolót bekapcsolva, a bejegyzés a rovat oldalon mindig előbbre kerül,
            mint a többi bejegyzés. Ha több bejegyzés is ki van emelve, akkor a kiemelt bejegyzések is a közzététel
            ideje szerint fognak megjelenni.
          </>
        }
        options={categories}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        hideSelectedOptions
        components={{ MultiValue: SelectCategoryChip }}
        noOptionsMessage={noOptionsMessage('Nem található kategória!')}
        isDisabled={!rights.EDIT}
      />
    );
  };

  renderGallerySelect = ({ field }) => {
    const { rights } = this.props;
    const { galleries } = this.state;

    return (
      <Select
        {...field}
        formik
        label="Galéria"
        placeholder="Válassz gallériát"
        options={galleries}
        getOptionValue={getGalleryValue}
        getOptionLabel={getGalleryLabel}
        hideSelectedOptions
        noOptionsMessage={noOptionsMessage('Nem található galéria!')}
        isDisabled={!rights.EDIT}
        isClearable
      />
    );
  };

  onCreateTag = (field, form) => (inputValue) => {
    const { createdTags } = this.state;
    const newTag = {
      id: `new-${inputValue}`,
      name: inputValue,
      status: TagStatus.NOT_APPROVED,
    };
    this.setState({
      createdTags: [...createdTags, newTag],
    });
    form.setFieldValue(field.name, [...(field.value || []), newTag]);
  };

  renderTagsSelect = ({ field, form }) => {
    const { rights } = this.props;

    return (
      <Select
        {...field}
        formik
        async
        creatable
        isMulti
        cacheOptions
        defaultOptions
        label="Cimkék"
        placeholder="Válassz cimkéket..."
        helperText={
          <>
            A cimkéknek kettős szerepe van: egyrészt a bejegyzés tartalom alatt megjelenik a cimkefelhőben, másrészt a
            kapcsolódó bejegyzések ez alapján listázódnak.
            <br />A cimkék melletti kapcsolóval be lehet kapcsolni, hogy csak a rendszer csak az első vagy az összes
            cimke alapján gyűjtse a kapcsolódó bejegyzéseket.
          </>
        }
        getOptionValue={this.getOptionValue}
        getOptionLabel={this.getOptionLabel}
        hideSelectedOptions
        components={{ MultiValue: SelectTagChip }}
        noOptionsMessage={noOptionsMessage('Nincs ilyen cimke!')}
        getNewOptionData={getNewTagData}
        isValidNewOption={isValidNewTag}
        onCreateOption={this.onCreateTag(field, form)}
        isDisabled={!rights.EDIT}
        loadOptions={loadTags}
      />
    );
  };

  renderStatus = ({ field }) => {
    const { classes, rights } = this.props;
    const id = `id-${field.name}`;

    return (
      <FormControl className={clsx(classes.formControl)} fullWidth disabled={!rights.SET_STATUS}>
        <InputLabel htmlFor={id}>Állapot</InputLabel>
        <MuiSelect {...field} inputProps={{ id, name: field.name }}>
          {map(PostStatus, (status) => (
            <MenuItem key={status} value={status}>
              {PostStatusText[status]}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    );
  };

  renderContentEditor = () => {
    const { content } = this.state;
    return (
      <CKEditor
        editor={CustomEditor}
        data={content}
        onReady={(editor) => {
          this.ckEditorRef.current = editor;
        }}
        config={{
          ...ckEditorConfig,
          imagePicker: {
            onClick: ({ insertImage, editor }) => this.setState({ showImagePicker: { insertImage, editor } }),
          },
        }}
      />
    );
  };

  onImagePickerSelect = (/* form */) => (media) => {
    const imageUrl = getMediaUrl(media);
    const {
      showImagePicker: { insertImage },
    } = this.state;
    insertImage(imageUrl);

    this.setState({ showImagePicker: false });
  };

  onImagePickerClose = (/* event */) => {
    this.setState({ showImagePicker: false });
  };

  onContentModeClick = (form, contentMode, oldContentMode) => (/* event */) => {
    if (oldContentMode === PostContentMode.WYSIWYG) {
      this.setState({ content: this.getContent(form.values) });
    }
    form.setFieldValue('contentMode', contentMode);
  };

  onContentChange = (event) => {
    this.setState({ content: event.target.value });
  };

  getPostMaxPriority = () => {
    const { preferences } = this.props;
    return get(preferences, 'api.posts.max.priority');
  };

  getPostContentCss = () => {
    const { preferences } = this.props;
    return get(preferences, 'posts.content.css');
  };

  renderEditor = (form) => {
    const {
      values: { status, contentMode, slugEditable, title, redirectUrl },
    } = form;
    const { classes, rights } = this.props;
    const { showImagePicker, content, categories, polls, viewMode } = this.state;

    const fieldProps = {
      ...defaultFieldProps,
      disabled: !rights.EDIT,
    };
    const { fullWidth, InputLabelProps, ...switchFieldProps } = fieldProps;

    const slugFieldProps = {
      ...fieldProps,
      InputProps: { className: classes.slugFormControl },
      name: 'slug',
      label: 'URL részlet',
      placeholder: 'A bejegyzéshez tartozó URL részlet...',
      disabled: !rights.EDIT || !slugEditable,
      required: true,
    };

    return (
      <div className={classes.editor} ref={this.editorRef}>
        <style type="text/css">{this.getPostContentCss()}</style>
        <div className="editor-left">
          <Grid container className="container" spacing={2}>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="title"
                label="Cím"
                placeholder="Bejegyzés címe..."
                multiline
                required
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12} className={classes.flexRow}>
              <Field
                component={Switch}
                type="checkbox"
                name="slugEditable"
                title="Egyedi URL engedélyezése"
                disabled={!rights.EDIT}
                {...switchFieldProps}
              />
              {slugEditable ? (
                <Field component={TextField} {...slugFieldProps} />
              ) : (
                <MuiTextField value={kebabCase(title)} {...slugFieldProps} />
              )}
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="attributes.description"
                label="Leírás közösségi médiában"
                placeholder="A cikk rövid leírása közösségi média tartalmakhoz..."
                required
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="lead"
                multiline
                label="Bevezető szöveg"
                helperText="Link megjelenítése új ablakban megnyitva: [Szöveg|http://goolge.com], a jelenlegi oldalon megnyitva: [Szöveg|=http://google.com]"
                placeholder="Bevezető szöveg..."
                {...fieldProps}
              />
            </Grid>
            <Grid className={clsx('post-content', viewMode.toLowerCase())} item xs={12}>
              <Grid container>
                <Grid item xs className={classes.contentModeSelector}>
                  {map(PostContentMode, (mode) => (
                    <Button
                      key={mode}
                      variant={contentMode !== mode ? 'text' : 'contained'}
                      color="primary"
                      onClick={this.onContentModeClick(form, mode, contentMode)}
                      disabled={!rights.SWITCH_CONTENT_MODE}
                    >
                      {PostContentModeText[mode]}
                    </Button>
                  ))}
                </Grid>
                <Grid item xs className={classes.viewModeSelector}>
                  {map(viewModes, (mode) => (
                    <Button
                      key={mode}
                      variant={viewMode !== mode ? 'text' : 'contained'}
                      color="primary"
                      onClick={() => this.setState({ viewMode: mode })}
                    >
                      {ViewModeText[mode]}
                    </Button>
                  ))}
                </Grid>
              </Grid>
              <ImagePicker
                open={showImagePicker}
                onSelect={this.onImagePickerSelect(form)}
                onClose={this.onImagePickerClose}
                fullWidth
                maxWidth="lg"
              />
              {contentMode === PostContentMode.WYSIWYG && this.renderContentEditor()}
              {contentMode === PostContentMode.HTML && (
                <MuiTextField
                  name="content"
                  variant="outlined"
                  multiline
                  lead="HTML tartalom"
                  value={content}
                  onChange={this.onContentChange}
                  {...fieldProps}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <Field
                component={ImageSelectField.Formik}
                name="image"
                label="Elsődleges kép"
                placeholder="Válassz képet..."
                {...fieldProps}
                croppers={croppers}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                component={ImageSelectField.Formik}
                name="imageSecondary"
                label="Másodlagos kép"
                placeholder="Válassz képet..."
                {...fieldProps}
                croppers={croppersSecondary}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="attributes.videoUrl"
                label="Videó URL"
                placeholder="Írd be a YouTube URL-t..."
                {...fieldProps}
              />
            </Grid>
          </Grid>
        </div>
        <div className="editor-right">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Field name="status" {...fieldProps}>
                {this.renderStatus}
              </Field>
            </Grid>
            <Grid item xs={6}>
              {status === PostStatus.APPROVE_ON && (
                <Field
                  component={DateTimePicker}
                  inline
                  name="approveOn"
                  label="Ütemezés ideje"
                  required
                  disablePast
                  maxDate="9999-12-31"
                  invalidDateMessage="Hibás formátum (pl.: 2019.12.27 13:45)!"
                  minDateMessage="Nem adható múltbeli dátum!"
                  {...fieldProps}
                  disabled={fieldProps.disabled || !rights.SET_STATUS_APPROVE_ON}
                />
              )}
              {status === PostStatus.APPROVED && (
                <Field
                  component={DateTimePicker}
                  inline
                  name="approvedAt"
                  label="Közzététel ideje"
                  required
                  maxDate="9999-12-31"
                  invalidDateMessage="Hibás formátum (pl.: 2019.12.27 13:45)!"
                  {...fieldProps}
                  disabled={!rights.SET_STATUS_APPROVED}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Field
                component={SimpleSelect}
                name="segment"
                label="Fül (szegmens)"
                items={segmentItems}
                {...fieldProps}
              />
            </Grid>
            {categories && (
              <Grid container item xs={12} alignItems="center" wrap="nowrap">
                <Field name="categories">{this.renderCategoriesSelect}</Field>
                <Field
                  component={Switch}
                  type="checkbox"
                  name="categoryPriority"
                  title="Kategória kiemelés"
                  disabled={!rights.EDIT}
                  {...switchFieldProps}
                />
              </Grid>
            )}
            <Grid container item xs={12} alignItems="center" wrap="nowrap">
              <Field name="tags">{this.renderTagsSelect}</Field>
              <Field
                component={Switch}
                type="checkbox"
                name="attributes.relatedPostsOnlyFromFirstTag"
                title="Kapcsolódó bejegyzések csak az első cimkéből"
                disabled={!rights.EDIT}
                {...switchFieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CheckboxWithLabel}
                type="checkbox"
                name="skipSearch"
                Label={{
                  label: (
                    <Label tooltip="Ha bekapcsoljuk, akkor a bejegyzés nem lesz elérhető a keresőben.">
                      Nem kereshető
                    </Label>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={SliderField}
                name="priority"
                label="Top N (prioritás)"
                min={0}
                max={this.getPostMaxPriority()}
                step={1}
                switchable
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={SimpleSelect}
                name="priorityMode"
                label="Ragadós"
                items={priorityModeItems}
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field component={TextField} name="source" label="Forrás" placeholder="Forrás..." {...fieldProps} />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="attributes.photo"
                label="Fotó"
                placeholder="Fotó (szöveg)..."
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                name="attributes.illustration"
                label="Illusztráció"
                placeholder="Illusztráció (szöveg)..."
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12} className={classes.flexRow}>
              <MuiSwitch
                name="redirectAllowed"
                title="Átirányítás engedélyezése vagy tiltása"
                checked={!!redirectUrl}
                onClick={onRedirectClick(form)}
                {...switchFieldProps}
              />
              <Field
                component={TextField}
                name="redirectUrl"
                label="Átirányítás az alábbi URL-re (helyi vagy távoli)"
                placeholder="Átirányítás URL-re..."
                helperText={
                  <>
                    A cikkre kattintva az ide beírt URL nyílik meg (pl. /csaladvedelmi-akcioterv vagy
                    http://www.startlap.hu). Ha ay első karakter &lsquo;+&rsquo; karakter, akkor az megadott link új
                    lapon fog megnyílni!
                  </>
                }
                {...fieldProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Field name="gallery">{this.renderGallerySelect}</Field>
            </Grid>
            {polls && (
              <Grid item xs={12}>
                <Field component={SimpleSelect} name="pollId" label="Szavazás" items={polls} {...fieldProps} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Field
                component={TextField}
                inputProps={{ className: classes.code }}
                name="attributes.css"
                label="Stíluslap (haladó)"
                placeholder="Egyedi stíluslap (CSS) beágyazása..."
                variant="outlined"
                multiline
                minRows={2}
                maxRows={8}
                {...fieldProps}
                disabled={fieldProps.disabled || !rights.EDIT_CSS}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                inputProps={{ className: classes.code }}
                component={TextField}
                name="attributes.script"
                label="Javascript (haladó)"
                placeholder="Egyedi Javascript kód beágyazása..."
                variant="outlined"
                multiline
                minRows={2}
                maxRows={8}
                {...fieldProps}
                disabled={fieldProps.disabled || !rights.EDIT_JS}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };

  getContent = ({ contentMode }) => {
    const { content } = this.state;
    return contentMode === PostContentMode.WYSIWYG ? this.ckEditorRef.current?.getData() : content;
  };

  isDirty = (form) => {
    const content = this.getContent(form.values);
    const { originalContent } = this.state;
    return form.dirty || content !== originalContent;
  };

  renderForm = (form) => {
    const { classes, post, rights } = this.props;
    const { categories, polls } = this.state;
    const {
      values: { status },
      isSubmitting,
      submitCount,
      errors,
      handleSubmit,
    } = form;
    const dirty = this.isDirty(form);
    const allowPreview = rights.PREVIEW;
    const allowSave = rights.EDIT;
    const allowSubmit = categories && polls && !isSubmitting && (!submitCount || !hasError(errors));

    const actions = [
      {
        id: Action.PREVIEW,
        visible: allowPreview,
        disabled: !post.id || dirty,
        icon: <RemoveRedEyeIcon />,
        text: 'Előnézet',
        color: 'secondary',
      },
      {
        id: Action.SAVE_AND_CONTINUE,
        visible: allowSave,
        disabled: !allowSubmit,
        icon: <SaveIcon />,
        text: 'Ment & Folytat',
        color: 'secondary',
      },
      {
        id: Action.SAVE,
        visible: allowSave,
        disabled: !allowSubmit,
        icon: <SaveAltIcon />,
        text: 'Ment & Kilép',
        color: 'secondary',
      },
      {
        id: Action.SAVE_AND_READY,
        visible: rights.SET_STATUS_READY && !rights.SET_STATUS_APPROVED && allowSave,
        disabled: !allowSubmit,
        icon: <DoneIcon />,
        text: 'Ment & Kész',
        color: 'secondary',
      },
      {
        id: Action.SAVE_AND_APPROVE,
        visible:
          ((status === PostStatus.APPROVE_ON && rights.SET_STATUS_APPROVE_ON) || rights.SET_STATUS_APPROVED) &&
          allowSave,
        disabled: !allowSubmit,
        icon: status === PostStatus.APPROVE_ON ? <AlarmOnIcon /> : <DoneAllIcon />,
        text: status === PostStatus.APPROVE_ON ? 'Ment & Ütemez' : 'Ment & Közzétesz',
        color: 'secondary',
      },
    ];

    const modalEditorClasses = {
      root: clsx(classes.modal),
      closeButton: clsx(classes.modalCloseButton),
      dialogTitle: clsx(classes.modalDialogTitle),
      dialogContent: clsx(classes.modalDialogContent),
      dialogActions: clsx(classes.modalDialogActions),
    };

    return (
      <ModalEditor
        onSubmit={handleSubmit}
        classes={modalEditorClasses}
        title={post && post.id ? `Bejegyzés szerkesztése: ${post.title}` : 'Új bejegyzés'}
        onClose={this.onDialogClose}
        titleActions={actions}
        actionContext={form}
        onActionClick={this.onActionClick}
        dirty={
          dirty && allowSave && 'Ha elnavigálsz, a bejegyzésen végzet módosítások el fognak veszni! Biztosan folytatod?'
        }
      >
        {this.renderEditor(form)}
      </ModalEditor>
    );
  };

  render() {
    return (
      <Formik initialValues={this.initialValues} validate={validate} onSubmit={this.onFormSubmit}>
        {this.renderForm}
      </Formik>
    );
  }
}
PostEditor.propTypes = {
  classes: PropTypes.shape({
    formControl: PropTypes.string,
    slugFormControl: PropTypes.string,
    editor: PropTypes.string,
    flexRow: PropTypes.string,
    contentModeSelector: PropTypes.string,
    viewModeSelector: PropTypes.string,
    code: PropTypes.string,
    modal: PropTypes.string,
    modalCloseButton: PropTypes.string,
    modalDialogTitle: PropTypes.string,
    modalDialogContent: PropTypes.string,
    modalDialogActions: PropTypes.string,
  }).isRequired,
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
  }),
  submitAction: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  rights: PostRightsPropType.isRequired,
  preferences: PropTypes.shape({
    'api.posts.max.priority': PropTypes.number,
    'posts.content.css': PropTypes.string,
  }).isRequired,
};

PostEditor.defaultProps = {
  post: null,
};

const mapStateToProps = (state) => ({
  preferences: AppSelectors.getPreferences(state),
});

const mapDispatchToProps = (/* dispatch */) => ({});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PostEditor));
