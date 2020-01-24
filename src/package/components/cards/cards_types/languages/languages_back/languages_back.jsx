import React, { useMemo } from 'react';

import { createUseStyles, useTheme } from 'react-jss';
import { animated, useTransition } from 'react-spring';
import chroma from 'chroma-js';

import { ProfileCardAnimatedBack } from '../../../../commons/profile_card/profile_card_animated_back/profile_card_animated_back';
import { LanguageColumn } from './language_column/language_column';

import { getColorsFromCardVariant, getHexFromPaletteColor } from '../../../../../utils/styles/styles_utils';

import { styles } from './languages_back_styles';
import { useCardVariant } from '../../../../commons/profile_card/profile_card_hooks/use_card_variant';

const useStyles = createUseStyles(styles);

const LanguagesBackComponent = ({ data }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [variant] = useCardVariant();
    const transitions = useTransition(data.languages ?? [], ({ id }) => `language_column_${id}`, {
        from: {
            transform: 'translate3d(0, 50%, 0)'
        },
        enter: {
            transform: 'translate3d(0, 0, 0)'
        },
        trail: 175
    });

    const { backColor, backBackgroundColor } = useMemo(
        () => ({
            backColor: getHexFromPaletteColor(theme, getColorsFromCardVariant(theme, variant).backColor),
            backBackgroundColor: getHexFromPaletteColor(
                theme,
                getColorsFromCardVariant(theme, variant).backBackgroundColor
            )
        }),
        [theme, variant]
    );

    const colorPalette = useMemo(
        () =>
            Array.from({ length: data.languages?.length ?? 0 }, (v, k) =>
                chroma.mix(backColor, backBackgroundColor, (2 * k) / 15).hex()
            ),
        [backColor, backBackgroundColor]
    );

    return (
        <ProfileCardAnimatedBack
            title="Languages"
            customClasses={{ content: classes.content, contentAnimated: classes.contentAnimated }}
        >
            <div className={classes.columnsContainer}>
                {transitions.map(({ item, key, props }, index) => (
                    <LanguageColumn
                        itemsSize={data.languages?.length ?? 0}
                        key={key}
                        component={animated.div}
                        value={item.value}
                        style={{
                            ...props,
                            backgroundColor: colorPalette[index],
                            color: backColor
                        }}
                        cardVariant={variant}
                    >
                        {item.language?.substring(0, 2).toUpperCase()}
                    </LanguageColumn>
                ))}
            </div>
        </ProfileCardAnimatedBack>
    );
};

export const LanguagesBack = LanguagesBackComponent;