import React, { FC, useState, useCallback, useEffect } from 'react'
import { Steps, message } from 'antd'

import { Message, useAltIntl } from '../../../intlConfig'
import UserForm from './UserForm'
import TenantDataForm from '../TenantDataForm'
import { TenantConfig } from '../../../typings'
import personalInfo from '../../../assets/personal.svg'
import { useAuth, upsertUser } from '../../../contexts/auth/AuthContext'

const { Step } = Steps

const OnboardStepper: FC = () => {
  const intl = useAltIntl()
  const [loading, setLoading] = useState(false)
  const [{ user, userDb, userDbId }, dispatch] = useAuth()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (userDb?.name) {
      setStep(1)
    }
  }, [userDb])

  const handleUserSubmit = useCallback(
    (data) => {
      setLoading(true)

      const userData = {
        ...userDb,
        ...data,
        email: user?.email,
        uid: user?.uid,
        hasTenant: false,
      }

      upsertUser(dispatch, {
        userData,
        userDbId,
      })
        .then(() => {
          setStep(1)
        })
        .catch(() => {
          message.error(intl.formatMessage({ id: 'onboard.error' }))
        })
    },
    [intl, userDb, userDbId, user, dispatch]
  )

  const handleTenantSubmit = useCallback((data: Partial<TenantConfig>) => {
    // Use Tenant Context
    // Create actions for creating the tenant
    // Initialize Tenant
    return Promise.resolve()
  }, [])

  return (
    <div className="pa1 pa4-l">
      <Steps current={step}>
        <Step title={<Message id="onboard.personalData" />} />
        <Step title={<Message id="onboard.yourBusiness" />} />
      </Steps>
      {step === 0 && (
        <div className="flex flex-column">
          <div className="flex justify-between-l items-center pv4 flex-row-l flex-column">
            <div className="flex flex-column w-90 w-60-l">
              <h1>
                <Message id="onboard.label.main" />
              </h1>
              <p className="f4">
                <Message id="onboard.label.sub1" />
                <b>
                  <Message id="onboard.label.sub2" />
                </b>
                <Message id="onboard.label.sub3" />
              </p>
            </div>
            <img
              src={personalInfo}
              alt="Personal Info"
              style={{
                maxWidth: '200px',
              }}
            />
          </div>
          <UserForm onSubmit={handleUserSubmit} loading={loading} />
        </div>
      )}
      {step === 1 && (
        <div className="pt3 mt3">
          <TenantDataForm onSubmit={handleTenantSubmit} loading={loading} />
        </div>
      )}
    </div>
  )
}

export default OnboardStepper
