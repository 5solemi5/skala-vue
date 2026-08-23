import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    name: 'app/custom-rules',
    rules: {
      // 엄격한 비교 연산자(===) 사용을 강제한다.
      // == 는 타입을 멋대로 변환해서 비교하기 때문에 의도치 않은 결과가 나온다.
      eqeqeq: ['error', 'always'],
      // 실습 단계에서는 콘솔로 동작을 확인하는 코드가 많아 console.log 를 허용한다.
      'no-console': 'off',
    },
  },

  {
    // shadcn-vue 는 Button / Card / Badge 처럼 단어 하나짜리 이름을 관례로 쓴다.
    // 라이브러리 규약을 따르는 폴더라서 이 폴더에 한해 다중 단어 규칙을 끈다.
    name: 'app/shadcn-ui',
    files: ['src/components/ui/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  skipFormatting,
])
