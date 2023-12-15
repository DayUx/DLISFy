provider "aws" {
  region     = "eu-north-1"
  access_key = "AKIA4Y4E7AI5G7XNZOHM"
  secret_key = "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"
}

resource "aws_vpc" "myvpc" {
  cidr_block = "10.0.0.0/16"
  tags       = {
    Name = "MyVPC"
  }
}

resource "aws_subnet" "public_subnet_1a" {
  vpc_id     = aws_vpc.myvpc.id
  cidr_block = "10.0.1.0/24"
  tags       = {
    Name = "PublicSubnet1a"
  }
}

resource "aws_subnet" "public_subnet_1b" {
  vpc_id     = aws_vpc.myvpc.id
  cidr_block = "10.0.2.0/24"
  tags       = {
    Name = "PublicSubnet1b"
  }
}

resource "aws_subnet" "private_subnet_1a" {
  vpc_id     = aws_vpc.myvpc.id
  cidr_block = "10.0.3.0/24"
  tags       = {
    Name = "PrivateSubnet1a"
  }
}

resource "aws_subnet" "private_subnet_1b" {
  vpc_id     = aws_vpc.myvpc.id
  cidr_block = "10.0.4.0/24"
  tags       = {
    Name = "PrivateSubnet1b"
  }
}

resource "aws_internet_gateway" "myigw" {
  vpc_id = aws_vpc.myvpc.id
  tags   = {
    Name = "MyInternetGateway"
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.myvpc.id
  tags   = {
    Name = "PublicRouteTable"
  }

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.myigw.id
  }

  //route target local
  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
  }
}

resource "aws_route_table_association" "public_route_table_association_1" {
  subnet_id      = aws_subnet.public_subnet_1a.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_route_table_association_2" {
  subnet_id      = aws_subnet.public_subnet_1b.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_eip" "myeip" {
  vpc  = true
  tags = {
    Name = "MyEIP"
  }
}


resource "aws_nat_gateway" "myng" {
  allocation_id = aws_eip.myeip.id
  subnet_id     = aws_subnet.public_subnet_1a.id
  tags          = {
    Name = "MyNatGateway"
  }
  depends_on = [aws_internet_gateway.myigw]
}



resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.myvpc.id
  tags   = {
    Name = "PrivateRouteTable"
  }

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.myng.id
  }

  route {
    cidr_block = "10.0.0.0/16"
    gateway_id = "local"
  }
}


resource "aws_route_table_association" "private_route_table_association_1" {
  subnet_id      = aws_subnet.private_subnet_1a.id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "private_route_table_association_2" {
  subnet_id      = aws_subnet.private_subnet_1b.id
  route_table_id = aws_route_table.private_route_table.id
}


resource "aws_lb" "myalb" {
  name               = "MyALB"
  load_balancer_type = "application"
  subnets            = [aws_subnet.public_subnet_1a.id, aws_subnet.public_subnet_1b.id]
  security_groups    = [aws_security_group.alb.id]
}

resource "aws_lb_target_group" "mytg" {
  name     = "MyTG"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.myvpc.id

}


resource "aws_lb_target_group_attachment" "mytg_attachment_1" {
  target_group_arn = aws_lb_target_group.mytg.arn
  target_id        = aws_instance.app1.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "mytg_attachment_2" {
  target_group_arn = aws_lb_target_group.mytg.arn
  target_id        = aws_instance.app2.id
  port             = 80
}


resource "aws_lb_listener" "mylistener" {
  load_balancer_arn = aws_lb.myalb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_lb_target_group.mytg.arn
    type             = "forward"
  }
}

resource "aws_security_group" "alb" {
  name        = "MyALBSecurityGroup"
  description = "Allow inbound traffic to the ALB"
  vpc_id      = aws_vpc.myvpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "bastion" {
  name        = "MyBastionSecurityGroup"
  description = "Allow inbound traffic to the Bastion"
  vpc_id      = aws_vpc.myvpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  //egress accept all
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
#resource "aws_instance" "bastion" {
#  ami           = "ami-0416c18e75bd69567"
#  instance_type = "t2.micro"
#  subnet_id = aws_subnet.public_subnet_1a.id
#  tags = {
#    Name = "Bastion"
#  }
#
#  security_groups = [aws_security_group.bastion.id]
#}



locals {
  user_data = <<-EOF
#!/bin/bash
sudo dnf update
sudo dnf install -y docker git
wget https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)
sudo mv docker-compose-$(uname -s)-$(uname -m) /usr/local/bin/docker-compose
sudo chmod -v +x /usr/local/bin/docker-compose
sudo systemctl start docker.service
sudo systemctl enable docker
sudo systemctl status docker
sudo usermod -a -G docker ec2-user
newgrp docker
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
git clone https://github.com/DayUx/puntify.git
cd puntify
docker-compose up -d
EOF

}

resource "aws_instance" "app1" {
  ami                    = "ami-0416c18e75bd69567"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.private_subnet_1a.id
  vpc_security_group_ids = [aws_security_group.bastion.id]

  tags = {
    Name = "App1"
  }

  depends_on = [
    aws_nat_gateway.myng,
    aws_route_table.private_route_table
  ]


  user_data = local.user_data

}

resource "aws_instance" "app2" {
  ami                    = "ami-0416c18e75bd69567"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.private_subnet_1b.id
  vpc_security_group_ids = [aws_security_group.bastion.id]
  tags                   = {
    Name = "App2"
  }

  depends_on = [
    aws_nat_gateway.myng,
    aws_route_table.private_route_table
  ]
  user_data = local.user_data
}
