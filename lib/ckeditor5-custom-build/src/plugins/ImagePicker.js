import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

class ImagePicker extends Plugin {

  /**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImagePicker';
	}

  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('pickImage', locale => {
      const view = new ButtonView( locale );

      view.set({
          label: 'Válassz képet',
          icon: imageIcon,
          tooltip: true
      });

      // Callback executed once the image is clicked.
      view.on('execute', () => {
        const { onClick } = editor.config.get('imagePicker');
        const insertImage = (source) => editor.execute('insertImage', { source } );
        onClick({ insertImage, editor });
      });

      return view;
    });

    console.log( 'ImagePicker was initialized',  );
  }
}

export default ImagePicker;