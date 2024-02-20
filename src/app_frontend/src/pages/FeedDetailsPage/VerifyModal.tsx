import React, { useEffect, useState } from 'react';
import { Space, Card, Typography, Flex, Button, Drawer, Alert } from 'antd';
import ConfettiExplosion, { ConfettiProps } from 'react-confetti-explosion';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import config from 'Constants/config';
import Loader from 'Components/Loader';
import useSybilFeeds from 'Providers/SybilPairs/useSybilFeeds';
import { add0x } from 'Utils/addressUtils';

const confetti: ConfettiProps = {
  force: 0.6,
  duration: 2500,
  particleCount: 100,
  width: 1000,
};

const errorConfetti: ConfettiProps = {
  ...confetti,
  colors: ['#FF0000', '#FF4D4F', '#FF7A45', '#FFA940', '#FFC53D'],
};

const successConfetti: ConfettiProps = {
  ...confetti,
  colors: ['#2F21FF', '#0089D7', '#1890FF', '#4A6293', '#fff'],
};

type VerifyModalProps = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  signatureData: string;
  id: string;
};

export const VerifyModal = ({ isVisible, setIsVisible, signatureData, id }: VerifyModalProps) => {
  const [isConfettiExplode, setIsConfettiExplode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyData, setVerifyData] = useState('');
  const [isValid, setIsValid] = useState(false);
  const { readVerifyUnpacked } = useSybilFeeds();

  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;

  const getAssetDataWithProof = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${config.sybil_canister_id}.icp0.io/get_asset_data_with_proof?id=${id}`
      );
      const data = await response.json();
      setVerifyData(data);
      return data;
    } catch (error) {
      console.error('Error fetching asset data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickVerify = async () => {
    try {
      const verifyUnpacked = await readVerifyUnpacked(signatureData);
      console.log(verifyUnpacked);
      setIsConfettiExplode(true);
      setIsValid(true);
    } catch (error) {
      console.error('Error verifying signature', error);
      setIsConfettiExplode(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    getAssetDataWithProof();
  }, []);

  const confettiProps = isValid ? successConfetti : errorConfetti;

  return (
    <Drawer
      title="Verify Signature"
      placement="right"
      onClose={(e) => {
        e.stopPropagation();
        setIsVisible(false);
      }}
      open={isVisible}
      style={{ marginTop: '47px' }}
      width={isMobile ? '90vw' : '362px'}
      footer={
        <Flex
          gap="middle"
          justify="end"
          style={{
            marginTop: '-100px',
          }}
        >
          <Button
            onClick={() => {
              setIsVisible(false);
            }}
          >
            Done
          </Button>
          <Button type="primary" onClick={onClickVerify}>
            Verify
            {isConfettiExplode && <ConfettiExplosion {...confettiProps} zIndex={1001} />}
          </Button>
        </Flex>
      }
    >
      <Space size="middle" direction="vertical">
        <Typography.Paragraph>
          The following message was used to calculate the median price for the BTC/USD Oracle. You
          can verify its authenticity with Ethereum's ecrecover() function.
        </Typography.Paragraph>
        <Alert
          message="Note: You can edit the message to prove that any changes will invalidate the signature."
          type="warning"
          showIcon
        />
        <Card
          bordered={false}
          style={{
            backgroundColor: '#050B15',
          }}
        >
          <Typography.Text editable={{ onChange: (str) => setVerifyData(str) }} code={true}>
            {isLoading ? (
              <Flex align="center" justify="center" style={{ height: 200 }}>
                <Loader />
              </Flex>
            ) : (
              JSON.stringify(verifyData, null, 2)
            )}
          </Typography.Text>
        </Card>
        <Space size="small" direction="vertical">
          Validator Address
          <Typography.Text copyable ellipsis style={{ maxWidth: 300 }}>
            {add0x(signatureData)}
          </Typography.Text>
        </Space>
      </Space>
    </Drawer>
  );
};
