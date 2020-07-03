import Generator from 'yeoman-generator';

class AppMaterialGenerator extends Generator {
  writing(): void {
    this.fs.copy(this.templatePath('static/**'), this.destinationPath());
  }

  install(): void {
    this.npmInstall([
      '@material-ui/core',
      '@material-ui/icons',
      'fontsource-roboto',
    ]);
  }
}

export default AppMaterialGenerator;
