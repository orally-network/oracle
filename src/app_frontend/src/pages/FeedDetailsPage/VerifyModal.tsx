import React, { useState } from 'react';
import { Space, Card, Typography, Flex, Drawer, Alert } from 'antd';
import ConfettiExplosion, { ConfettiProps } from 'react-confetti-explosion';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import Loader from 'Components/Loader';
import useSybilFeeds from 'Providers/SybilPairs/useSybilFeeds';
import { add0x } from 'Utils/addressUtils';
import { ExportOutlined } from '@ant-design/icons';
import IconLink from 'Components/IconLink';
import ReactJson from '@microlink/react-json-view';
import { toast } from 'react-toastify';
import Button from 'Components/Button';
import { VerifyData } from 'Interfaces/feed';

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
  feedDataWithProof: VerifyData;
};

export const VerifyModal = ({
  isVisible,
  setIsVisible,
  signatureData,
  id,
  feedDataWithProof,
}: VerifyModalProps) => {
  const [isConfettiExplode, setIsConfettiExplode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { readVerifyUnpacked } = useSybilFeeds();
  const [verifyData, setVerifyData] = useState<VerifyData>({ ...feedDataWithProof });

  const { width } = useWindowDimensions();
  const isMobile = width < BREAK_POINT_MOBILE;

  const onClickVerify = async () => {
    setIsLoading(true);
    try {
      const verifyUnpacked = await readVerifyUnpacked({
        pairId: id,
        price: verifyData.data.hasOwnProperty('DefaultPriceFeed')
          ? verifyData.data.DefaultPriceFeed.rate
          : verifyData.data.CustomPriceFeed.rate,
        decimals: verifyData.data.hasOwnProperty('DefaultPriceFeed')
          ? verifyData.data.DefaultPriceFeed.decimals
          : verifyData.data.CustomPriceFeed.decimals,
        timestamp: verifyData.data.hasOwnProperty('DefaultPriceFeed')
          ? verifyData.data.DefaultPriceFeed.timestamp
          : verifyData.data.CustomPriceFeed.timestamp,
        signature: add0x(verifyData.signature),
      });
      setIsConfettiExplode(true);
      setIsValid(verifyUnpacked);
      if (!verifyUnpacked) {
        toast.error('Signature is invalid');
      } else {
        toast.success('Signature is valid');
      }
    } catch (error) {
      setIsConfettiExplode(true);
      toast.error('Something went wrong. Try again later.');
      setIsValid(false);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Button type="primary" onClick={onClickVerify} disabled={isLoading}>
            Verify
            {isConfettiExplode && <ConfettiExplosion {...confettiProps} zIndex={1001} />}
          </Button>
        </Flex>
      }
    >
      <Space size="middle" direction="vertical">
        <Typography.Paragraph>
          The following message was used to calculate the median price for the {id} Oracle. You can
          verify its authenticity with Ethereum's verifyUnpacked() function.
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
          {isLoading ? (
            <Flex align="center" justify="center" style={{ height: 200 }}>
              <Loader />
            </Flex>
          ) : (
            <ReactJson
              style={{
                maxWidth: '350px',
              }}
              src={verifyData}
              theme="tomorrow"
              displayObjectSize={false}
              displayDataTypes={false}
              collapseStringsAfterLength={300}
              onEdit={(obj) => setVerifyData(obj?.updated_src)}
              indentWidth={2}
            />
          )}
        </Card>
        <Space size="small" direction="vertical">
          Validator Address
          <Space size="small">
            <Typography.Text copyable ellipsis style={{ maxWidth: 300 }}>
              {add0x(signatureData)}
            </Typography.Text>
            <IconLink
              link={
                'https://arbiscan.io/address/0x49353d54cc6d23079c6748a2a2160d39a5b3358e#readContract'
              }
              IconComponent={ExportOutlined}
            />
          </Space>
        </Space>
      </Space>
    </Drawer>
  );
};
