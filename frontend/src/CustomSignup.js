
/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import * as React from 'react';

import { I18n } from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

import AuthPiece from 'aws-amplify-react/lib/Auth/AuthPiece';
import {
    FormSection,
    SectionHeader,
    SectionBody,
    SectionFooter,
    FormField,
    Input,
    InputLabel,
    SelectInput,
    Button,
    Link,
    SectionFooterPrimaryContent,
    SectionFooterSecondaryContent,
} from 'aws-amplify-react/lib/Amplify-UI/Amplify-UI-Components-React';

import countryDialCodes from 'aws-amplify-react/lib/Auth/common/country-dial-codes.js';
export default class SignUp extends AuthPiece {
    constructor(props) {
        super(props);

        this._validAuthStates = ['signUp'];
        this.signUp = this.signUp.bind(this);

        this.inputs = {
            dial_code: "+1",
        };
    }

    signUp() {
        const { username, password, email, dial_code='+1', phone_line_number } = this.inputs;
        if (!Auth || typeof Auth.signUp !== 'function') {
            throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
        }

        let signup_info = {
            username,
            password, 
            attributes: {
                
            }
        };

        let phone_number = phone_line_number? `${dial_code}${phone_line_number.replace(/[-()]/g, '')}`: null;

        if (phone_number) {
            signup_info.attributes.phone_number = phone_number;
        }

        Auth.signUp(signup_info).then(() => this.changeState('confirmSignUp', username))
        .catch(err => this.error(err));
    }

    showComponent(theme) {
        const { hide } = this.props;
        if (hide && hide.includes(SignUp)) { return null; }

        // console.log(countryDialCodes.sort());

        return (
            <FormSection theme={theme}>
                <SectionHeader theme={theme}>{I18n.get('Create a new account')}</SectionHeader>
                <SectionBody theme={theme}>
                    <FormField theme={theme}>
                        <InputLabel>{I18n.get('Email Address')} *</InputLabel>
                        <Input
                            autoFocus
                            placeholder={'Enter your Email'}
                            theme={theme}
                            key="username"
                            name="username"
                            onChange={this.handleInputChange}
                        />
                    </FormField>
                    <FormField theme={theme}>
                        <InputLabel>{I18n.get('Password')} *</InputLabel>
                        <Input
                            placeholder={I18n.get('Create a password')}
                            theme={theme}
                            type="password"
                            key="password"
                            name="password"
                            onChange={this.handleInputChange}
                        />
                    </FormField>
                    
                </SectionBody>
                <SectionFooter theme={theme}>
                    <SectionFooterPrimaryContent theme={theme}>
                        <Button onClick={this.signUp} theme={theme}>
                            {I18n.get('Create Account')}
                        </Button>
                    </SectionFooterPrimaryContent>
                    <SectionFooterSecondaryContent theme={theme}>
                        {I18n.get('Have an account? ')}
                        <Link theme={theme} onClick={() => this.changeState('signIn')}>
                            {I18n.get('Sign in')}
                        </Link>
                    </SectionFooterSecondaryContent>
                </SectionFooter>
            </FormSection>
        );
    }
}