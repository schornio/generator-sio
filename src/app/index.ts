import Generator, { Questions } from 'yeoman-generator';

class AppGenerator extends Generator {
  props?: { [key: string]: string };

  async prompting(): Promise<void> {
    const questions: Questions = [
      {
        default: this.appname,
        message: 'Package name',
        name: 'packageName',
        type: 'input',
      },
      {
        message: 'Package description',
        name: 'packageDescription',
        type: 'input',
      },
      {
        message: 'Keywords',
        name: 'packageKeywords',
        type: 'input',
      },
      {
        default: 'Thomas Schorn <thomas@schorn.io>',
        message: 'Author',
        name: 'packageAuthor',
        store: true,
        type: 'input',
      },
      {
        choices: ['MIT', 'UNLICENSED'],
        message: 'License',
        name: 'packageLicense',
        type: 'list',
      },
      {
        choices: ['plain', 'material_ui'],
        message: 'UI library',
        name: 'uiLibrary',
        type: 'list',
      },
    ];

    const answers = await this.prompt(questions);
    this.props = answers;

    switch (answers.uiLibrary) {
      case 'material_ui':
        this.composeWith(
          'sio:app_material_ui',
          {},
          { link: 'strong', local: require.resolve('../app_material_ui') },
        );
    }
  }

  default(): void {
    this.spawnCommandSync('git', ['init']);
  }

  configuring(): void {
    if (this.props) {
      this.fs.writeJSON('package.json', {
        author: this.props.packageAuthor,
        browserslist: {
          development: [
            'last 1 chrome version',
            'last 1 firefox version',
            'last 1 safari version',
          ],
          production: ['>0.2%', 'not dead', 'not op_mini all'],
        },
        dependencies: {
          eslint: '^6.8.0', // Pin eslint to v6 until v7 is supported
        },
        description: this.props.packageDescription,
        husky: {
          hooks: {
            'pre-commit': 'npm run lint',
          },
        },
        keywords: this.props.packageKeywords,
        license: this.props.packageLicense,
        name: this.props.packageName,
        private: true,
        scripts: {
          build: 'react-scripts build',
          format: 'prettier  --config ./.prettierrc --write src/**/*.{ts,tsx}',
          lint: [
            'prettier  --config ./.prettierrc --check src/**/*.{ts,tsx}',
            'eslint --no-error-on-unmatched-pattern src/**/*.{ts,tsx}',
            'tsc --noEmit',
          ].join(' && '),
          start: 'react-scripts start',
          test: 'react-scripts test',
        },
        version: '0.0.0',
      });
    }
  }

  writing(): void {
    this.fs.copy(this.templatePath('static/**'), this.destinationPath(), {
      globOptions: { dot: true },
    });
    if (this.props) {
      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('public/index.html'),
        {
          packageDescription: this.props.packageDescription,
          packageName: this.props.packageName,
        },
      );
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        {
          generatorVersion: process.env.npm_package_version,
          packageDescription: this.props.packageDescription,
          packageName: this.props.packageName,
        },
      );
    }
  }

  install(): void {
    this.npmInstall();
    this.npmInstall([
      '@testing-library/jest-dom',
      '@testing-library/react',
      '@testing-library/user-event',
      '@types/jest',
      '@types/node',
      '@types/react',
      '@types/react-dom',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-plugin-react',
      'husky',
      'prettier',
      'react',
      'react-dom',
      'react-scripts',
      'typescript',
      'typescript-plugin-css-modules',
    ]);
  }
}

export default AppGenerator;
